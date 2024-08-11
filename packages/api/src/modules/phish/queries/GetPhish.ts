import type { Phishing } from '../../../@types/phishtools.schema.js';
import { PhishToolsErrorCodes } from '../../../core/error/codes.js';
import { PhishToolsError } from '../../../core/error/PhishToolsError.js';
import type { PhishToolsResolver } from '../../interfaces.js';

export const GetPhish: PhishToolsResolver<
	Phishing | null,
	{
		id: string;
	},
	true
> = async (_, { id }, { db }) => {
	const phishingRecord = await db('phishing').where('id', id).first();

	if (!phishingRecord || phishingRecord.hidden) {
		throw new PhishToolsError(
			'Phishing record not found',
			PhishToolsErrorCodes.PhishNotFound,
		);
	}

	return phishingRecord ?? null;
};
