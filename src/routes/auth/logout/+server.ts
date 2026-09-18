import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearPlayerCookie } from '$lib/server/auth/playerSession';

export const GET: RequestHandler = async ({ cookies, url }) => {
	clearPlayerCookie(cookies);
	const rawReturnTo = url.searchParams.get('returnTo');
	const returnTo = rawReturnTo?.startsWith('/') ? rawReturnTo : '/';
	throw redirect(303, returnTo);
};

export const POST: RequestHandler = async ({ cookies, url }) => {
	clearPlayerCookie(cookies);
	const rawReturnTo = url.searchParams.get('returnTo');
	const returnTo = rawReturnTo?.startsWith('/') ? rawReturnTo : '/';
	throw redirect(303, returnTo);
};
