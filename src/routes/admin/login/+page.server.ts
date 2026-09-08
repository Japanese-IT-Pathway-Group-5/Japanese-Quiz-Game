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

		const isCorrect = verifyAdminPassword(submitted, platform!.env.ADMIN_PASSWORD);

		if (!isCorrect) {
			return fail(400, { error: GENERIC_ERROR });
		}

		await createAdminCookie(cookies, platform!.env.AUTH_SECRET);
		redirect(303, '/admin');
	}
};
