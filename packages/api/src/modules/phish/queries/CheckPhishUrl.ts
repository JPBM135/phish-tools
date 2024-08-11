import type { Phishing } from '../../../@types/phishtools.schema.js';
import { URL_REGEX } from '../../../constants.js';
import { PhishToolsErrorCodes } from '../../../core/error/codes.js';
import { PhishToolsError } from '../../../core/error/PhishToolsError.js';
import { insertPhishLog } from '../../../core/logs/insertPhishLog.js';
import type { PhishToolsResolver } from '../../interfaces.js';
import { URL } from 'url';

export const CheckPhishUrl: PhishToolsResolver<
	Phishing | null,
	{
		url: string;
	},
	true
> = async (_, { url }, { db }) => {
	const isUrl = URL_REGEX.test(url);

	if (!isUrl) {
		throw new PhishToolsError('Invalid URL', PhishToolsErrorCodes.PhishInvalidUrl);
	}

	const phishUrl = new URL(url);

	const phishingRecord = await db('phishing').where('domain', phishUrl.hostname).first();

	if (phishingRecord) {
		return phishingRecord.hidden ? null : phishingRecord;
	}

	const [createdPhishingRecord] = await db('phishing')
		.insert({
			domain: phishUrl.hostname,
			url: phishUrl.origin + phishUrl.pathname,
		})
		.returning('*');

	if (!createdPhishingRecord) {
		throw new PhishToolsError('Failed to create phishing record', PhishToolsErrorCodes.InternalServerError);
	}

	await insertPhishLog(db, {
		message: 'Phishing record created',
		phishing_id: createdPhishingRecord.id,
	});

	return createdPhishingRecord;
};
