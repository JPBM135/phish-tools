import bcrypt from 'bcrypt';
import type { Users } from '../../../@types/phishtools.schema.js';
import { PhishToolsError } from '../../../core/error/PhishToolsError.js';
import { PhishToolsErrorCodes } from '../../../core/error/codes.js';
import { checkState } from '../../../core/state/checkState.js';
import type { PhishToolsResolver } from '../../interfaces.js';
import { handleTokenGeneration } from '../common/handleTokenGeneration.js';

interface AuthInput {
	input: {
		email: string;
		nonce: string;
		password: string;
	};
}

interface AuthResponse {
	token: string;
	user: Users;
}

export const Auth: PhishToolsResolver<AuthResponse, AuthInput> = async (
	_,
	{ input: { email, nonce, password } },
	{ db },
) => {
	if (!nonce) {
		throw new PhishToolsError('Invalid state', PhishToolsErrorCodes.InvalidState);
	}

	const valid = checkState(nonce);
	if (!valid) {
		throw new PhishToolsError('Invalid state', PhishToolsErrorCodes.InvalidState);
	}

	const user = await db.select('*').from('users').where('email', email).first();

	if (!user) {
		throw new PhishToolsError('Invalid email or password', PhishToolsErrorCodes.InvalidEmailOrPassword);
	}

	const validPassword = await bcrypt.compare(password, user.password || '');

	if (!validPassword) {
		throw new PhishToolsError('Invalid email or password', PhishToolsErrorCodes.InvalidEmailOrPassword);
	}

	return handleTokenGeneration(user);
};
