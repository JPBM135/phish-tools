import { Buffer } from 'node:buffer';
import { createHmac } from 'node:crypto';
import dayjs from 'dayjs';
import { config } from '../../config.js';
import { AUTH_ISSUER_API } from '../../constants.js';
import type { UsersTokens } from '../../@types/phishtools.schema.js';

function stringifyAndEncode(data: unknown) {
	const stringifiedData = JSON.stringify(data);
	return Buffer.from(stringifiedData, 'utf8').toString('base64url');
}

export function generateApiToken(token: UsersTokens) {
	const header = {
		alg: 'HS512',
		typ: 'JWT',
	};

	const encodedHeader = stringifyAndEncode(header);

	const payload = {
		tokenId: token.id,
		user: token.user_id,
		permissions: token.permissions,
		iat: dayjs().unix(),
		iss: AUTH_ISSUER_API,
	};

	if (token.expires_at) {
		Reflect.set(payload, 'exp', dayjs(token.expires_at).unix());
	}

	const encodedPayload = stringifyAndEncode(payload);

	const parts = [
		encodedHeader,
		encodedPayload,
		createHmac('sha512', config.secret.apiHmac)
			.update(encodedHeader + '.' + encodedPayload)
			.digest('base64url'),
	];

	return parts.join('.');
}
