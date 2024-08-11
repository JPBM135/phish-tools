import type { PhishToolsResolver } from '../../../modules/interfaces.js';
import { generateState } from '../../../core/state/generateState.js';

// eslint-disable-next-line id-length
export const GetNonce: PhishToolsResolver<
	{
		nonce: string;
	},
	unknown
> = async () => {
	const nonce = generateState();

	return { nonce };
};
