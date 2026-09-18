import { describe, it, expect } from 'vitest';
import {
	getGoogleAuthUrl,
	createAndSetOAuthStateCookie,
	verifyAndClearOAuthStateCookie,
	linkGoogleAccountToPlayer,
	OAUTH_STATE_COOKIE_NAME
} from './googleAuth';
import type { Cookies } from '@sveltejs/kit';
import { getTableName } from 'drizzle-orm';
import type { AppDb } from '$lib/server/db';
import type * as schema from '$lib/server/db/schema';

const SECRET = 'test-secret-12345678901234567890123456789012';

function createMockCookies(
	initial: Record<string, string> = {}
): Cookies & { store: Map<string, string> } {
	const store = new Map(Object.entries(initial));
	return {
		store,
		get(name: string) {
			return store.get(name);
		},
		set(name: string, value: string, _opts?: unknown) {
			void _opts;
			store.set(name, value);
		},
		delete(name: string) {
			store.delete(name);
		},
		getAll() {
			return Array.from(store.entries()).map(([name, value]) => ({ name, value }));
		},
		serialize() {
			return '';
		}
	};
}

function extractCondition(condition: unknown): { col: string | null; val: unknown } {
	if (!condition || typeof condition !== 'object') return { col: null, val: null };
	const condObj = condition as Record<string, unknown>;
	if (Array.isArray(condObj.queryChunks)) {
		let col: string | null = null;
		let val: unknown = null;
		for (const chunk of condObj.queryChunks) {
			if (chunk && typeof chunk === 'object') {
				const chunkObj = chunk as Record<string, unknown>;
				if (typeof chunkObj.name === 'string') {
					col = chunkObj.name;
				} else if ('value' in chunkObj && !Array.isArray(chunkObj.value)) {
					val = chunkObj.value;
				}
			}
		}
		return { col, val };
	}
	return { col: null, val: null };
}

function createFakeDb() {
	const mockPlayers: schema.Player[] = [];
	const mockAttempts: schema.QuizAttempt[] = [];

	const fakeDb = {
		insert: (table: unknown) => ({
			values: (val: unknown) => {
				const data = (Array.isArray(val) ? val : [val]) as Record<string, unknown>[];
				const tableName = getTableName(table as Parameters<typeof getTableName>[0]);
				if (tableName === 'players') {
					mockPlayers.push(...(data as unknown as schema.Player[]));
				} else if (tableName === 'quiz_attempts') {
					mockAttempts.push(...(data as unknown as schema.QuizAttempt[]));
				}
				return {
					onConflictDoUpdate: () => Promise.resolve(),
					returning: () => Promise.resolve(data)
				};
			}
		}),
		select: () => ({
			from: (table: unknown) => ({
				where: (condition: unknown) => {
					const tableName = getTableName(table as Parameters<typeof getTableName>[0]);
					const { col, val } = extractCondition(condition);
					if (tableName === 'players') {
						if (col === 'google_id') {
							return Promise.resolve(mockPlayers.filter((p) => p.googleId === val));
						}
						if (col === 'id') {
							return Promise.resolve(mockPlayers.filter((p) => p.id === val));
						}
						return Promise.resolve([]);
					}
					if (tableName === 'quiz_attempts') {
						if (col === 'player_id') {
							return Promise.resolve(mockAttempts.filter((a) => a.playerId === val));
						}
						return Promise.resolve(mockAttempts);
					}
					return Promise.resolve([]);
				}
			})
		}),
		update: (table: unknown) => ({
			set: (values: Record<string, unknown>) => ({
				where: (condition: unknown) => {
					const tableName = getTableName(table as Parameters<typeof getTableName>[0]);
					const { col, val } = extractCondition(condition);
					if (tableName === 'players') {
						const target = col === 'id' ? mockPlayers.find((p) => p.id === val) : mockPlayers[0];
						if (target) {
							Object.assign(target, values);
							return {
								returning: () => Promise.resolve([target])
							};
						}
					}
					if (tableName === 'quiz_attempts') {
						for (const attempt of mockAttempts) {
							if (!col || (col === 'player_id' && attempt.playerId === val)) {
								Object.assign(attempt, values);
							}
						}
					}
					return {
						returning: () => Promise.resolve([])
					};
				}
			})
		})
	} as unknown as AppDb;

	return { fakeDb, mockPlayers, mockAttempts };
}

describe('googleAuth', () => {
	describe('getGoogleAuthUrl', () => {
		it('constructs a valid Google OAuth URL with query params', () => {
			const url = getGoogleAuthUrl({
				clientId: 'test-client-id.apps.googleusercontent.com',
				redirectUri: 'https://example.com/auth/google/callback',
				state: 'secure-state-token'
			});

			const parsed = new URL(url);
			expect(parsed.origin).toBe('https://accounts.google.com');
			expect(parsed.pathname).toBe('/o/oauth2/v2/auth');
			expect(parsed.searchParams.get('client_id')).toBe(
				'test-client-id.apps.googleusercontent.com'
			);
			expect(parsed.searchParams.get('redirect_uri')).toBe(
				'https://example.com/auth/google/callback'
			);
			expect(parsed.searchParams.get('response_type')).toBe('code');
			expect(parsed.searchParams.get('scope')).toBe('openid email profile');
			expect(parsed.searchParams.get('state')).toBe('secure-state-token');
		});
	});

	describe('OAuth state cookies', () => {
		it('creates, signs, and successfully verifies the state cookie', async () => {
			const cookies = createMockCookies();
			const state = await createAndSetOAuthStateCookie(cookies, '/results/attempt-123', SECRET);

			expect(cookies.get(OAUTH_STATE_COOKIE_NAME)).toBe(state);

			const verified = await verifyAndClearOAuthStateCookie(cookies, state, SECRET);
			expect(verified).not.toBeNull();
			expect(verified?.returnTo).toBe('/results/attempt-123');
			expect(verified?.nonce).toBeDefined();

			// Cookie must be cleared after verification
			expect(cookies.get(OAUTH_STATE_COOKIE_NAME)).toBeUndefined();
		});

		it('rejects tampered or mismatched state', async () => {
			const cookies = createMockCookies();
			const state = await createAndSetOAuthStateCookie(cookies, '/results/attempt-123', SECRET);

			// Mismatched state param
			const verifiedMismatch = await verifyAndClearOAuthStateCookie(
				cookies,
				'different-state',
				SECRET
			);
			expect(verifiedMismatch).toBeNull();

			// Tampered cookie
			cookies.set(OAUTH_STATE_COOKIE_NAME, state + 'tampered', { path: '/' });
			const verifiedTampered = await verifyAndClearOAuthStateCookie(
				cookies,
				state + 'tampered',
				SECRET
			);
			expect(verifiedTampered).toBeNull();
		});
	});

	describe('linkGoogleAccountToPlayer', () => {
		it('links a Google account to an existing anonymous player', async () => {
			const { fakeDb, mockPlayers } = createFakeDb();
			const playerId = 'anonymous-player-1';

			mockPlayers.push({
				id: playerId,
				nickname: 'Tanaka',
				email: null,
				googleId: null,
				avatarUrl: null,
				isAnonymous: true,
				createdAt: new Date()
			});

			const result = await linkGoogleAccountToPlayer(fakeDb, {
				currentPlayerId: playerId,
				profile: {
					id: 'google-user-123',
					email: 'tanaka@gmail.com',
					name: 'Tanaka Kenji',
					picture: 'https://example.com/photo.jpg'
				}
			});

			expect(result.playerId).toBe(playerId);
			expect(result.isExistingAccount).toBe(false);
			expect(result.player.googleId).toBe('google-user-123');
			expect(result.player.email).toBe('tanaka@gmail.com');
			expect(result.player.avatarUrl).toBe('https://example.com/photo.jpg');
			expect(result.player.isAnonymous).toBe(false);

			expect(mockPlayers[0].googleId).toBe('google-user-123');
			expect(mockPlayers[0].isAnonymous).toBe(false);
		});

		it('migrates quiz attempts when logging into an existing Google account', async () => {
			const { fakeDb, mockPlayers, mockAttempts } = createFakeDb();
			const existingAccountId = 'existing-google-user-player-id';
			const currentAnonymousId = 'temp-anonymous-player-id';

			mockPlayers.push({
				id: existingAccountId,
				nickname: 'Verified Player',
				googleId: 'google-sub-456',
				email: 'verified@gmail.com',
				avatarUrl: null,
				isAnonymous: false,
				createdAt: new Date()
			});

			const attemptId = 'attempt-to-migrate';
			mockAttempts.push({
				id: attemptId,
				playerId: currentAnonymousId,
				nickname: 'Temp Player',
				level: 'N4',
				chosenQuestions: ['q1'],
				currentQuestionIndex: 1,
				correctCount: 1,
				finalScore: 100,
				startedAt: new Date(),
				finishedAt: new Date(),
				status: 'finished'
			});

			const cookies = createMockCookies();
			const result = await linkGoogleAccountToPlayer(fakeDb, {
				currentPlayerId: currentAnonymousId,
				profile: {
					id: 'google-sub-456',
					email: 'verified@gmail.com',
					name: 'Verified Player',
					picture: 'https://example.com/avatar.png'
				},
				cookies,
				authSecret: SECRET
			});

			expect(result.playerId).toBe(existingAccountId);
			expect(result.isExistingAccount).toBe(true);
			expect(result.migratedAttemptCount).toBe(1);
			expect(mockAttempts[0].playerId).toBe(existingAccountId);
		});
	});
});
