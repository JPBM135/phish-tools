import { Buffer } from 'node:buffer';
import { PhishToolsError } from '../error/PhishToolsError.js';
import { PhishToolsErrorCodes } from '../error/codes.js';

export function decodeJWT<H, P>(token: string): { header: H; payload: P; signature: string } {
	const [encodedHeader, encodedPayload, signature] = token.split('.');
	if (!encodedHeader || !encodedPayload || !signature) {
		throw new PhishToolsError('Invalid token', PhishToolsErrorCodes.InvalidToken);
	}

	try {
		const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString());
		const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
		return {
			header,
			payload,
			signature,
		};
	} catch {
		throw new PhishToolsError('Invalid token', PhishToolsErrorCodes.InvalidToken);
	}
}
