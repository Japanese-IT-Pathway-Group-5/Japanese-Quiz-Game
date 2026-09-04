import { describe, it, expect } from 'vitest';
import { signValue, verifySignedValue } from './signedValue';

const SECRET = 'test-secret-do-not-use-in-real-life';
const OTHER_SECRET = 'a-completely-different-secret';

describe('signValue / verifySignedValue', () => {
	it('round-trips a value signed and verified with the same secret', async () => {
		const signed = await signValue('player-42', SECRET);
		const verified = await verifySignedValue(signed, SECRET);

		expect(verified).toBe('player-42');
	});

	it('round-trips a value that itself contains the separator character', async () => {
		const signed = await signValue('a.b.c', SECRET);
		const verified = await verifySignedValue(signed, SECRET);

		expect(verified).toBe('a.b.c');
	});

	it('rejects a value that has been tampered with', async () => {
		const signed = await signValue('player-42', SECRET);
		const tampered = signed.replace('player-42', 'player-99');

		const verified = await verifySignedValue(tampered, SECRET);

		expect(verified).toBeNull();
	});

	it('rejects a signature that has been tampered with', async () => {
		const signed = await signValue('player-42', SECRET);
		const lastChar = signed.at(-1);
		const flippedChar = lastChar === 'a' ? 'b' : 'a';
		const tampered = signed.slice(0, -1) + flippedChar;

		const verified = await verifySignedValue(tampered, SECRET);

		expect(verified).toBeNull();
	});

	it('rejects a signature produced with a different secret', async () => {
		const signed = await signValue('player-42', SECRET);

		const verified = await verifySignedValue(signed, OTHER_SECRET);

		expect(verified).toBeNull();
	});

	it('produces a different signature for the same value with a different secret', async () => {
		const signedWithSecret = await signValue('player-42', SECRET);
		const signedWithOtherSecret = await signValue('player-42', OTHER_SECRET);

		expect(signedWithSecret).not.toBe(signedWithOtherSecret);
	});

	it('rejects a string with no signature separator', async () => {
		const verified = await verifySignedValue('not-a-signed-value', SECRET);

		expect(verified).toBeNull();
	});

	it('rejects an empty string', async () => {
		const verified = await verifySignedValue('', SECRET);

		expect(verified).toBeNull();
	});

	it('rejects a signature containing invalid base64url characters', async () => {
		const signed = await signValue('player-42', SECRET);
		const verified = await verifySignedValue(`${signed}!!!`, SECRET);

		expect(verified).toBeNull();
	});
});
