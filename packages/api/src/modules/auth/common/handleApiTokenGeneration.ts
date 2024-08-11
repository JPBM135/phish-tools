import type { UsersTokens } from '../../../@types/phishtools.schema.js';
import { generateApiToken } from '../../../core/auth/generateApiToken.js';

export async function handleTokenGeneration(token: UsersTokens) {
	return {
		data: token,
		token: generateApiToken(token),
	};
}
