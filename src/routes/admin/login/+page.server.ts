import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createAdminCookie, verifyAdminPassword } from '$lib/server/auth/adminSession';

const GENERIC_ERROR = 'Incorrect password.';

export const actions: Actions = {
	default: async ({ request, cookies, platform }) => {
		const data = await request.formData();
		const submitted = data.get('password');

		if (typeof submitted !== 'string' || submitted.length === 0) {
			// Same message as a wrong password — never hint at what was invalid.
			return fail(400, { error: GENERIC_ERROR });
		}

		const adminPassword =
			platform?.env?.ADMIN_PASSWORD ||
			(typeof process !== 'undefined' ? process.env?.ADMIN_PASSWORD : undefined) ||
			'admin123';
		const isCorrect = verifyAdminPassword(submitted, adminPassword);

		if (!isCorrect) {
			return fail(400, { error: GENERIC_ERROR });
		}

		const authSecret =
			platform?.env?.AUTH_SECRET ||
			(typeof process !== 'undefined' ? process.env?.AUTH_SECRET : undefined) ||
			'dev-secret-key-development-mode-1234567890';
		await createAdminCookie(cookies, authSecret);
		redirect(303, '/admin');
	}
};
