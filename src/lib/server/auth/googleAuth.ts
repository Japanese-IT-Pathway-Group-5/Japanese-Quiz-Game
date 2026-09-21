import type { Cookies } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { AppDb } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { signValue, verifySignedValue } from './signedValue';
import { setPlayerIdCookie } from './playerSession';

export const OAUTH_STATE_COOKIE_NAME = 'oauth_state';
const OAUTH_STATE_MAX_AGE_SECONDS = 10 * 60; // 10 minutes

export type GoogleUserProfile = {
	id: string; // Google sub
	email: string;
	name: string;
	picture?: string;
};

export type GoogleAuthConfig = {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
};

export type OAuthStatePayload = {
	returnTo: string;
	nonce: string;
};

/**
 * Builds the Google OAuth 2.0 authorization URL.
 */
export function getGoogleAuthUrl(params: {
	clientId: string;
	redirectUri: string;
	state: string;
}): string {
	const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	url.searchParams.set('client_id', params.clientId);
	url.searchParams.set('redirect_uri', params.redirectUri);
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('scope', 'openid email profile');
	url.searchParams.set('state', params.state);
	url.searchParams.set('prompt', 'select_account');
	return url.toString();
}

/**
 * Creates and signs an OAuth state token with a secure nonce and return destination,
 * and sets it as a secure HTTP-only cookie.
 */
export async function createAndSetOAuthStateCookie(
	cookies: Cookies,
	returnTo: string,
	secret: string
): Promise<string> {
	const payload: OAuthStatePayload = {
		returnTo: returnTo.startsWith('/') ? returnTo : '/',
		nonce: crypto.randomUUID()
	};
	const signedState = await signValue(JSON.stringify(payload), secret);

	cookies.set(OAUTH_STATE_COOKIE_NAME, signedState, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: OAUTH_STATE_MAX_AGE_SECONDS
	});

	return signedState;
}

/**
 * Validates the state parameter returned by Google against the signed cookie.
 */
export async function verifyAndClearOAuthStateCookie(
	cookies: Cookies,
	receivedState: string,
	secret: string
): Promise<OAuthStatePayload | null> {
	const cookieState = cookies.get(OAUTH_STATE_COOKIE_NAME);
	cookies.delete(OAUTH_STATE_COOKIE_NAME, { path: '/' });

	if (!cookieState || cookieState !== receivedState) {
		return null;
	}

	const rawJson = await verifySignedValue(cookieState, secret);
	if (!rawJson) {
		return null;
	}

	try {
		const parsed = JSON.parse(rawJson) as OAuthStatePayload;
		if (typeof parsed?.returnTo === 'string' && typeof parsed?.nonce === 'string') {
			return parsed;
		}
	} catch {
		return null;
	}

	return null;
}

/**
 * Exchanges authorization code for Google access token.
 */
export async function exchangeCodeForTokens(params: {
	code: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}): Promise<{ accessToken: string; idToken?: string }> {
	const body = new URLSearchParams({
		code: params.code,
		client_id: params.clientId,
		client_secret: params.clientSecret,
		redirect_uri: params.redirectUri,
		grant_type: 'authorization_code'
	});

	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: body.toString()
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Google token exchange failed (${response.status}): ${errorText}`);
	}

	const data = (await response.json()) as {
		access_token?: string;
		id_token?: string;
		token_type?: string;
	};

	if (!data.access_token) {
		throw new Error('Google token exchange response did not contain access_token');
	}

	return {
		accessToken: data.access_token,
		idToken: data.id_token
	};
}

/**
 * Fetches user profile information from Google userinfo endpoint.
 */
export async function getGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
	const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Google userinfo request failed (${response.status}): ${errorText}`);
	}

	const data = (await response.json()) as {
		sub?: string;
		email?: string;
		name?: string;
		picture?: string;
	};

	if (!data.sub) {
		throw new Error('Google userinfo did not contain sub (user ID)');
	}

	return {
		id: data.sub,
		email: data.email ?? '',
		name: data.name ?? 'Player',
		picture: data.picture
	};
}

export type LinkGoogleAccountResult = {
	playerId: string;
	player: schema.Player;
	isExistingAccount: boolean;
	migratedAttemptCount: number;
};

/**
 * Links a Google account profile to a player and migrates any quiz runs
 * associated with the current session.
 */
export async function linkGoogleAccountToPlayer(
	db: AppDb,
	params: {
		currentPlayerId: string;
		profile: GoogleUserProfile;
		cookies?: Cookies;
		authSecret?: string;
	}
): Promise<LinkGoogleAccountResult> {
	const { currentPlayerId, profile, cookies, authSecret } = params;

	// 1. Check if a player with this Google ID already exists
	const [existingGooglePlayer] = await db
		.select()
		.from(schema.players)
		.where(eq(schema.players.googleId, profile.id));

	if (existingGooglePlayer) {
		let migratedAttemptCount = 0;

		// If current anonymous session is different from the existing account,
		// associate all attempts made during the current anonymous session with the existing account
		if (existingGooglePlayer.id !== currentPlayerId) {
			const attemptsToMigrate = await db
				.select({ id: schema.quizAttempts.id })
				.from(schema.quizAttempts)
				.where(eq(schema.quizAttempts.playerId, currentPlayerId));

			if (attemptsToMigrate.length > 0) {
				await db
					.update(schema.quizAttempts)
					.set({ playerId: existingGooglePlayer.id })
					.where(eq(schema.quizAttempts.playerId, currentPlayerId));
				migratedAttemptCount = attemptsToMigrate.length;
			}
		}

		// Update profile info (email, avatar, name)
		const [updatedPlayer] = await db
			.update(schema.players)
			.set({
				email: profile.email || existingGooglePlayer.email,
				avatarUrl: profile.picture || existingGooglePlayer.avatarUrl,
				isAnonymous: false,
				nickname: existingGooglePlayer.nickname || profile.name
			})
			.where(eq(schema.players.id, existingGooglePlayer.id))
			.returning();

		if (cookies && authSecret) {
			await setPlayerIdCookie(cookies, existingGooglePlayer.id, authSecret);
		}

		return {
			playerId: existingGooglePlayer.id,
			player: updatedPlayer ?? existingGooglePlayer,
			isExistingAccount: true,
			migratedAttemptCount
		};
	}

	// 2. No existing player with this Google ID. Link the current player session.
	const [currentPlayer] = await db
		.select()
		.from(schema.players)
		.where(eq(schema.players.id, currentPlayerId));

	if (currentPlayer) {
		const [updatedPlayer] = await db
			.update(schema.players)
			.set({
				googleId: profile.id,
				email: profile.email,
				avatarUrl: profile.picture,
				isAnonymous: false,
				nickname: currentPlayer.nickname || profile.name
			})
			.where(eq(schema.players.id, currentPlayerId))
			.returning();

		if (cookies && authSecret) {
			await setPlayerIdCookie(cookies, currentPlayerId, authSecret);
		}

		return {
			playerId: currentPlayerId,
			player: updatedPlayer ?? {
				...currentPlayer,
				googleId: profile.id,
				email: profile.email,
				avatarUrl: profile.picture,
				isAnonymous: false
			},
			isExistingAccount: false,
			migratedAttemptCount: 0
		};
	}

	// 3. Current player did not exist in DB yet (e.g. fresh visitor directly signing in)
	const [newPlayer] = await db
		.insert(schema.players)
		.values({
			id: currentPlayerId,
			nickname: profile.name || 'Player',
			email: profile.email,
			googleId: profile.id,
			avatarUrl: profile.picture,
			isAnonymous: false
		})
		.returning();

	if (cookies && authSecret) {
		await setPlayerIdCookie(cookies, currentPlayerId, authSecret);
	}

	return {
		playerId: currentPlayerId,
		player: newPlayer,
		isExistingAccount: false,
		migratedAttemptCount: 0
	};
}
