import { describe, it, expect, vi } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import { getOrCreatePlayerId, PLAYER_COOKIE_NAME } from './playerSession';
import { signValue } from './signedValue';

const SECRET = 'test-secret-do-not-use-in-real-life';

function fakeCookies(initial?: string): Cookies {
	let stored: string | undefined = initial;
	return {
		get: vi.fn((name: string) => (name === PLAYER_COOKIE_NAME ? stored : undefined)),
		set: vi.fn((name: string, value: string) => {
			if (name === PLAYER_COOKIE_NAME) stored = value;
		}),
		delete: vi.fn(),
		getAll: vi.fn(() => []),
		serialize: vi.fn(() => '')
	} as unknown as Cookies;
}

describe('getOrCreatePlayerId', () => {
	it('issues a new id and sets a cookie for a first-time visitor', async () => {
		const cookies = fakeCookies();

		const playerId = await getOrCreatePlayerId(cookies, SECRET);

		expect(playerId).toMatch(/^[0-9a-f-]{36}$/);
		expect(cookies.set).toHaveBeenCalledOnce();
		const [name, , options] = (cookies.set as ReturnType<typeof vi.fn>).mock.calls[0];
		expect(name).toBe(PLAYER_COOKIE_NAME);
		expect(options).toMatchObject({ httpOnly: true, secure: true, path: '/' });
	});

	it('returns the same id for a returning visitor with a valid cookie', async () => {
		const signed = await signValue('existing-player-id', SECRET);
		const cookies = fakeCookies(signed);

		const playerId = await getOrCreatePlayerId(cookies, SECRET);

		expect(playerId).toBe('existing-player-id');
		expect(cookies.set).not.toHaveBeenCalled();
	});

	it('issues a fresh id instead of throwing when the cookie has been tampered with', async () => {
		const signed = await signValue('existing-player-id', SECRET);
		const tampered = signed.replace('existing-player-id', 'attacker-id');
		const cookies = fakeCookies(tampered);

		const playerId = await getOrCreatePlayerId(cookies, SECRET);

		expect(playerId).not.toBe('attacker-id');
		expect(playerId).toMatch(/^[0-9a-f-]{36}$/);
		expect(cookies.set).toHaveBeenCalledOnce();
	});

	it('issues a fresh id when the cookie was signed with a different secret', async () => {
		const signed = await signValue('existing-player-id', 'a-different-secret');
		const cookies = fakeCookies(signed);

		const playerId = await getOrCreatePlayerId(cookies, SECRET);

		expect(playerId).not.toBe('existing-player-id');
		expect(cookies.set).toHaveBeenCalledOnce();
	});
});
