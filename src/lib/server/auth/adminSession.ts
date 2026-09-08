import type { Cookies } from '@sveltejs/kit';
import { createHash, timingSafeEqual } from 'node:crypto';
import { signValue, verifySignedValue } from './signedValue';

const ADMIN_COOKIE_NAME = 'admin_session';
const ADMIN_SESSION_SECONDS = 60 * 60 * 4; // 4 hours

/**
 * Compares a submitted password against the expected one without leaking
 * timing information about how much of it was correct.
 *
 * Both strings are hashed to a fixed-length digest before comparing, so
 * `timingSafeEqual` never throws over a length mismatch (which would itself
 * leak the correct length) and the whole check always takes the same time
 * regardless of what was submitted.
 */
export function verifyAdminPassword(submitted: string, expected: string): boolean {
	const submittedHash = sha256(submitted);
	const expectedHash = sha256(expected);
	return timingSafeEqual(submittedHash, expectedHash);
}

function sha256(value: string): Buffer {
	return createHash('sha256').update(value, 'utf8').digest();
}

/**
 * Signs a short-lived admin session and sets it as a cookie. Called after a
 * successful password check.
 */
export async function createAdminCookie(cookies: Cookies, secret: string): Promise<void> {
	const signed = await signValue('admin', secret);

	cookies.set(ADMIN_COOKIE_NAME, signed, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: ADMIN_SESSION_SECONDS
	});
}

/**
 * Checks whether the current request carries a valid, unexpired, untampered
 * admin cookie. Used by the `/admin` route guard.
 */
export async function verifyAdminCookie(cookies: Cookies, secret: string): Promise<boolean> {
	const existing = cookies.get(ADMIN_COOKIE_NAME);
	if (!existing) {
		return false;
	}

	const value = await verifySignedValue(existing, secret);
	return value === 'admin';
}

/** Clears the admin cookie. Called on logout. */
export function clearAdminCookie(cookies: Cookies): void {
	cookies.delete(ADMIN_COOKIE_NAME, { path: '/' });
}
