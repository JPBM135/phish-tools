import type { Phishing } from '../../../@types/phishtools.schema.js';
import { URL_REGEX } from '../../../constants.js';
import { PhishToolsErrorCodes } from '../../../core/error/codes.js';
import { PhishToolsError } from '../../../core/error/PhishToolsError.js';
import { insertPhishLog } from '../../../core/logs/insertPhishLog.js';
import { checkSource } from '../../../core/phishing/commons/checkSource.js';
import { scanUrl } from '../../../core/phishing/commons/scanUrl.js';
import { SCANNERS, SOURCES } from '../../../core/phishing/index.js';
import type { PhishToolsResolver } from '../../interfaces.js';
import { URL } from 'url';
import logger from '../../../logger.js';

const resolverLogger = logger.createChildren('CheckPhishUrl');

export const CheckPhishUrl: PhishToolsResolver<
	Phishing | null,
	{
		url: string;
	},
	true
> = async (_, { url }, { db }) => {
	const isUrl = URL_REGEX.test(url);

	if (!isUrl) {
		throw new PhishToolsError(
			'Invalid URL',
			PhishToolsErrorCodes.PhishInvalidUrl,
		);
	}

	const phishUrl = new URL(url);

	const phishingRecord = await db('phishing')
		.where('url', phishUrl.origin + phishUrl.pathname)
		.andWhere('created_at', '>', db.raw("now() - interval '5 days'"))
		.first();

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
		throw new PhishToolsError(
			'Failed to create phishing record',
			PhishToolsErrorCodes.InternalServerError,
		);
	}

	await insertPhishLog(db, {
		message: 'Phishing record created',
		phishing_id: createdPhishingRecord.id,
	});

	for (const sourceName in SOURCES) {
		resolverLogger.info(`Checking ${url} with ${sourceName}`);
		await checkSource(sourceName as keyof typeof SOURCES, {
			db,
			phishing_id: createdPhishingRecord.id,
			url,
		}).catch((error) => {
			resolverLogger.error(
				`Failed to check ${url} with ${sourceName}: ${error}`,
			);
		});
	}

	for (const scannerName in SCANNERS) {
		resolverLogger.info(`Scanning ${url} with ${scannerName}`);
		await scanUrl(scannerName as keyof typeof SCANNERS, {
			db,
			phishing_id: createdPhishingRecord.id,
			url,
		}).catch((error) => {
			resolverLogger.error(
				`Failed to scan ${url} with ${scannerName}: ${error}`,
			);
		});
	}

	return createdPhishingRecord;
};
