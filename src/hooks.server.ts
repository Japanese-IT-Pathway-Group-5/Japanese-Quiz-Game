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

	const response = await resolve(event);

	// Cloudflare Edge & Static Asset Caching Optimization
	const path = event.url.pathname;
	if (
		path.startsWith('/images/') ||
		path.startsWith('/animations/') ||
		path.startsWith('/_app/immutable/') ||
		path.endsWith('.png') ||
		path.endsWith('.svg') ||
		path.endsWith('.lottie') ||
		path.endsWith('.webp')
	) {
		response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	} else if (!response.headers.has('Cache-Control')) {
		// Fast revalidation for dynamic SSR pages with edge caching
		response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
	}

	response.headers.set('X-Content-Type-Options', 'nosniff');

	return response;
};
