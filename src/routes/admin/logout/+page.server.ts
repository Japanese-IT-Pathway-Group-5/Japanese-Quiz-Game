import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { clearAdminCookie } from '$lib/server/auth/adminSession';

export const actions: Actions = {
	default: ({ cookies }) => {
		clearAdminCookie(cookies);
		redirect(303, '/admin/login');
	}
};
