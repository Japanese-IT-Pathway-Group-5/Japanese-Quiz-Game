import { describe, it, expect, vi } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import {
	verifyAdminPassword,
	createAdminCookie,
	verifyAdminCookie,
	clearAdminCookie
} from './adminSession';
import { signValue } from './signedValue';

const SECRET = 'test-secret-do-not-use-in-real-life';

function fakeCookies(initial?: string): Cookies {
	let stored: string | undefined = initial;
	return {
		get: vi.fn(() => stored),
		set: vi.fn((_name: string, value: string) => {
			stored = value;
		}),
		delete: vi.fn(() => {
			stored = undefined;
		}),
		getAll: vi.fn(() => []),
		serialize: vi.fn(() => '')
	} as unknown as Cookies;
}

describe('verifyAdminPassword', () => {
	it('accepts the correct password', () => {
		expect(
			verifyAdminPassword('correct-horse-battery-staple', 'correct-horse-battery-staple')
		).toBe(true);
	});

	it('rejects a wrong password', () => {
		expect(verifyAdminPassword('wrong', 'correct-horse-battery-staple')).toBe(false);
	});

	it('rejects a wrong password of a different length without throwing', () => {
		expect(() => verifyAdminPassword('short', 'a-much-longer-password')).not.toThrow();
		expect(verifyAdminPassword('short', 'a-much-longer-password')).toBe(false);
	});

	it('rejects an empty submitted password', () => {
		expect(verifyAdminPassword('', 'correct-horse-battery-staple')).toBe(false);
	});
});

describe('createAdminCookie / verifyAdminCookie', () => {
	it('verifies true right after a cookie is created', async () => {
		const cookies = fakeCookies();

		await createAdminCookie(cookies, SECRET);
		const isValid = await verifyAdminCookie(cookies, SECRET);

		expect(isValid).toBe(true);
	});

	it('sets the cookie as httpOnly and secure', async () => {
		const cookies = fakeCookies();

		await createAdminCookie(cookies, SECRET);

		const [, , options] = (cookies.set as ReturnType<typeof vi.fn>).mock.calls[0];
		expect(options).toMatchObject({ httpOnly: true, secure: true, path: '/' });
	});

	it('returns false when there is no cookie', async () => {
		const cookies = fakeCookies();

		expect(await verifyAdminCookie(cookies, SECRET)).toBe(false);
	});

	it('returns false for a tampered cookie', async () => {
		const signed = await signValue('admin', SECRET);
		const tampered = signed.replace('admin', 'attacker');
		const cookies = fakeCookies(tampered);

		expect(await verifyAdminCookie(cookies, SECRET)).toBe(false);
	});

	it('returns false for a cookie signed with a different secret', async () => {
		const signed = await signValue('admin', 'a-different-secret');
		const cookies = fakeCookies(signed);

		expect(await verifyAdminCookie(cookies, SECRET)).toBe(false);
	});
});

describe('clearAdminCookie', () => {
	it('removes the cookie', async () => {
		const cookies = fakeCookies();
		await createAdminCookie(cookies, SECRET);

		clearAdminCookie(cookies);

		expect(await verifyAdminCookie(cookies, SECRET)).toBe(false);
	});
});
