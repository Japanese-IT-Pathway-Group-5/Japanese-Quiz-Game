/**
 * Sign a value and later verify it hasn't been altered, using HMAC-SHA256 via
 * the Web Crypto API (`crypto.subtle`) — available in both Cloudflare Workers
 * and Node, unlike Node's `crypto` module, which Workers doesn't have.
 *
 * This is the primitive #9 (player session cookie) and #10 (admin cookie)
 * build on. It knows nothing about cookies, D1, or SvelteKit — just
 * "sign this string" and "was this string signed with this secret".
 *
 * The secret (`AUTH_SECRET`) is always a parameter, never imported from a
 * module-level constant, so it's read from `platform.env` at request time
 * and never baked into the build.
 */

const SIGNATURE_SEPARATOR = '.';

/**
 * Signs `value` with `secret` and returns `"<value>.<signature>"`.
 *
 * `value` should already be safe to store in a cookie (e.g. a UUID) — this
 * function does not escape it.
 */
export async function signValue(value: string, secret: string): Promise<string> {
	const signature = await hmac(value, secret);
	return `${value}${SIGNATURE_SEPARATOR}${toBase64Url(signature)}`;
}

/**
 * Verifies a string produced by {@link signValue}.
 *
 * Returns the original value if the signature is valid, or `null` for any
 * kind of failure — wrong secret, tampered value, tampered signature, or a
 * string that was never signed at all. Never throws, so callers (like the
 * session cookie in #9) can treat "invalid" the same as "no cookie" without
 * a try/catch of their own.
 */
export async function verifySignedValue(signed: string, secret: string): Promise<string | null> {
	const separatorIndex = signed.lastIndexOf(SIGNATURE_SEPARATOR);
	if (separatorIndex === -1) {
		return null;
	}

	const value = signed.slice(0, separatorIndex);
	const signatureBase64Url = signed.slice(separatorIndex + 1);

	let signatureBytes: ArrayBuffer;
	try {
		signatureBytes = fromBase64Url(signatureBase64Url);
	} catch {
		// Not valid base64url — definitely tampered, not a crypto failure.
		return null;
	}

	try {
		const key = await importHmacKey(secret, ['verify']);
		const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, encode(value));
		return isValid ? value : null;
	} catch {
		return null;
	}
}

async function hmac(value: string, secret: string): Promise<ArrayBuffer> {
	const key = await importHmacKey(secret, ['sign']);
	return crypto.subtle.sign('HMAC', key, encode(value));
}

function importHmacKey(secret: string, usages: KeyUsage[]): Promise<CryptoKey> {
	return crypto.subtle.importKey(
		'raw',
		encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		usages
	);
}

function encode(value: string): Uint8Array<ArrayBuffer> {
	// `TextEncoder#encode` types its result as `Uint8Array<ArrayBufferLike>`, which
	// `crypto.subtle`'s `BufferSource` param rejects — wrapping it copies the bytes
	// into a fresh, plain `ArrayBuffer`-backed array.
	return new Uint8Array(new TextEncoder().encode(value));
}

function toBase64Url(buffer: ArrayBuffer): string {
	let binary = '';
	for (const byte of new Uint8Array(buffer)) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): ArrayBuffer {
	const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
	const paddingLength = (4 - (base64.length % 4)) % 4;
	const binary = atob(base64 + '='.repeat(paddingLength));
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes.buffer;
}
