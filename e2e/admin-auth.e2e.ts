import { test, expect } from '@playwright/test';

test.describe('admin authentication', () => {
	test('visiting an admin page while logged out redirects to the login page', async ({ page }) => {
		await page.goto('/admin');
		await expect(page).toHaveURL(/\/admin\/login$/);
	});

	test('a wrong password is refused with a generic error', async ({ page }) => {
		await page.goto('/admin/login');
		await page.locator('#password').fill('definitely-the-wrong-password');
		await page.getByRole('button', { name: 'Log in' }).click();

		await expect(page.getByRole('alert')).toContainText('Incorrect password.');
		// Still on the login page, i.e. not let in.
		await expect(page).toHaveURL(/\/admin\/login$/);
	});
});
