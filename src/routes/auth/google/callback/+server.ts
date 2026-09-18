import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	verifyAndClearOAuthStateCookie,
	exchangeCodeForTokens,
	getGoogleUserProfile,
	linkGoogleAccountToPlayer
} from '$lib/server/auth/googleAuth';
import { getDb } from '$lib/server/db';

export const GET: RequestHandler = async ({ url, cookies, platform, locals }) => {
	const authSecret =
		platform?.env?.AUTH_SECRET ||
		(typeof process !== 'undefined' ? process.env?.AUTH_SECRET : undefined) ||
		'dev-secret-key-development-mode-1234567890';

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const oauthError = url.searchParams.get('error');

	// Verify state and retrieve original return destination
	const statePayload = state
		? await verifyAndClearOAuthStateCookie(cookies, state, authSecret)
		: null;
	const returnTo = statePayload?.returnTo ?? '/';

	if (oauthError || !code || !statePayload) {
		const redirectUrl = new URL(returnTo, url.origin);
		redirectUrl.searchParams.set('auth_error', oauthError || 'invalid_state');
		throw redirect(303, redirectUrl.pathname + redirectUrl.search);
	}

	const clientId =
		platform?.env?.GOOGLE_CLIENT_ID ||
		(typeof process !== 'undefined' ? process.env?.GOOGLE_CLIENT_ID : undefined);
	const clientSecret =
		platform?.env?.GOOGLE_CLIENT_SECRET ||
		(typeof process !== 'undefined' ? process.env?.GOOGLE_CLIENT_SECRET : undefined);

	if (!clientId || !clientSecret) {
		throw error(
			500,
			'Google OAuth is not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)'
		);
	}

	if (!platform?.env?.DB) {
		throw error(500, 'Database binding (DB) is unavailable.');
	}

	const redirectUri = `${url.origin}/auth/google/callback`;

	try {
		const tokens = await exchangeCodeForTokens({
			code,
			clientId,
			clientSecret,
			redirectUri
		});

		const profile = await getGoogleUserProfile(tokens.accessToken);
		const db = getDb(platform.env.DB);

		await linkGoogleAccountToPlayer(db, {
			currentPlayerId: locals.playerId,
			profile,
			cookies,
			authSecret
		});

		const redirectUrl = new URL(returnTo, url.origin);
		redirectUrl.searchParams.set('saved', 'true');
		throw redirect(303, redirectUrl.pathname + redirectUrl.search);
	} catch (e: unknown) {
		if (
			e &&
			typeof e === 'object' &&
			'status' in e &&
			typeof (e as { status: number }).status === 'number'
		) {
			throw e;
		}
		const redirectUrl = new URL(returnTo, url.origin);
		redirectUrl.searchParams.set('auth_error', 'login_failed');
		throw redirect(303, redirectUrl.pathname + redirectUrl.search);
	}
};
