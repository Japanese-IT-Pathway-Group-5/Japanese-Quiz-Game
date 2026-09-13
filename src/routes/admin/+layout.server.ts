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

	const isLoggedIn = await verifyAdminCookie(cookies, platform!.env.AUTH_SECRET);

	if (!isLoggedIn) {
		redirect(303, '/admin/login');
	}

	return {};
};
