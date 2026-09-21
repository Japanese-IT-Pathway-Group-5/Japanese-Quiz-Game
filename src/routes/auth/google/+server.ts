import { redirect, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import {
	getGoogleAuthUrl,
	createAndSetOAuthStateCookie,
	linkGoogleAccountToPlayer
} from '$lib/server/auth/googleAuth';
import { getDb } from '$lib/server/db';

export const GET: RequestHandler = async ({ url, cookies, platform, locals }) => {
	const authSecret =
		platform?.env?.AUTH_SECRET ||
		(typeof process !== 'undefined' ? process.env?.AUTH_SECRET : undefined) ||
		'dev-secret-key-development-mode-1234567890';

	const attemptId = url.searchParams.get('attemptId');
	const rawReturnTo = url.searchParams.get('returnTo');
	const returnTo = attemptId
		? `/results/${attemptId}`
		: rawReturnTo?.startsWith('/')
			? rawReturnTo
			: '/';

	const clientId =
		platform?.env?.GOOGLE_CLIENT_ID ||
		(typeof process !== 'undefined' ? process.env?.GOOGLE_CLIENT_ID : undefined);

	// Dev / Mock Login support when GOOGLE_CLIENT_ID is not configured or in dev mock mode
	const isDevMock = dev && (url.searchParams.get('mock') === 'true' || !clientId);
	if (isDevMock) {
		if (!platform?.env?.DB) {
			throw error(500, 'Database binding (DB) is unavailable.');
		}

		const db = getDb(platform.env.DB);
		const mockEmail = url.searchParams.get('email') || 'player@example.com';
		const mockName = url.searchParams.get('name') || 'Google Player';
		const mockId =
			url.searchParams.get('sub') || `google-dev-${mockEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

		await linkGoogleAccountToPlayer(db, {
			currentPlayerId: locals.playerId,
			profile: {
				id: mockId,
				email: mockEmail,
				name: mockName,
				picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(mockName)}`
			},
			cookies,
			authSecret
		});

		const redirectUrl = new URL(returnTo, url.origin);
		redirectUrl.searchParams.set('saved', 'true');
		throw redirect(303, redirectUrl.pathname + redirectUrl.search);
	}

	if (!clientId) {
		throw error(500, 'Google OAuth is not configured (missing GOOGLE_CLIENT_ID)');
	}

	const redirectUri = `${url.origin}/auth/google/callback`;
	const state = await createAndSetOAuthStateCookie(cookies, returnTo, authSecret);
	const authUrl = getGoogleAuthUrl({
		clientId,
		redirectUri,
		state
	});

	throw redirect(302, authUrl);
};
