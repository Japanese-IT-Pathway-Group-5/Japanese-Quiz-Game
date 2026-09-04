import type { Cookies } from '@sveltejs/kit';
import { signValue, verifySignedValue } from './signedValue';

/**
 * Recognises a visitor across page loads without requiring sign-up, using a
 * signed, httpOnly cookie holding a random player id.
 *
 * - First-time visitor: a new id is generated, signed, and set as a cookie.
 * - Returning visitor with a valid cookie: the same id is reused.
 * - Returning visitor with a missing, expired, or tampered cookie: treated
 *   as a new visitor (a fresh id is issued) rather than throwing an error.
 *
 * Called once per request from `hooks.server.ts`; other server code should
 * read `event.locals.playerId` instead of calling this directly, so the
 * cookie logic only lives in one place.
 */
export async function getOrCreatePlayerId(cookies: Cookies, secret: string): Promise<string> {
	const existing = cookies.get(PLAYER_COOKIE_NAME);

	if (existing) {
		const playerId = await verifySignedValue(existing, secret);
		if (playerId) {
			return playerId;
		}
		// Missing, expired, or tampered — fall through and issue a fresh id.
	}

	const playerId = crypto.randomUUID();
	const signed = await signValue(playerId, secret);

	cookies.set(PLAYER_COOKIE_NAME, signed, {
		path: '/',
		httpOnly: true, // not readable by browser JavaScript
		secure: true, // only sent over HTTPS
		sameSite: 'lax',
		maxAge: ONE_YEAR_IN_SECONDS
	});

	return playerId;
}

export const PLAYER_COOKIE_NAME = 'player_id';
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
