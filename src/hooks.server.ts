import type { Handle } from '@sveltejs/kit';
import { getOrCreatePlayerId } from '$lib/server/auth/playerSession';

/**
 * Runs on every request. Resolves the current visitor's player id once
 * here, so route code never needs to touch cookies directly — it just
 * reads `event.locals.playerId`.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const authSecret =
		event.platform?.env?.AUTH_SECRET ||
		(typeof process !== 'undefined' ? process.env?.AUTH_SECRET : undefined) ||
		'dev-secret-key-development-mode-1234567890';

	event.locals.playerId = await getOrCreatePlayerId(event.cookies, authSecret);

	return resolve(event);
};
