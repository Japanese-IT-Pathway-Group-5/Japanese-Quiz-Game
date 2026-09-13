import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { verifyAdminCookie } from '$lib/server/auth/adminSession';

/**
 * Guards every page under /admin. The login page itself is excluded, or
 * logging in would redirect back to itself in a loop.
 */
export const load: LayoutServerLoad = async ({ url, cookies, platform }) => {
	if (url.pathname === '/admin/login') {
		return {};
	}

	const authSecret =
		platform?.env?.AUTH_SECRET ||
		(typeof process !== 'undefined' ? process.env?.AUTH_SECRET : undefined) ||
		'dev-secret-key-development-mode-1234567890';
	const isLoggedIn = await verifyAdminCookie(cookies, authSecret);

	if (!isLoggedIn) {
		redirect(303, '/admin/login');
	}

	return {};
};
