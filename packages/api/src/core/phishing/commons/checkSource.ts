import type { Knex } from 'knex';
import { insertPhishLog } from '../../logs/insertPhishLog.js';
import { SOURCES } from '../index.js';
import { PhishingCategory } from '../sources/interfaces.js';

export async function checkSource(
	sourceName: keyof typeof SOURCES,
	{
		url,
		phishing_id,
		db,
	}: {
		url: string;
		phishing_id: string;
		db: Knex;
	},
) {
	const source = SOURCES[sourceName];
	const sourceInstance = source.getInstance();

	const checkResult = await sourceInstance.checkUrl(url).catch((error) => {
		console.error(error);
		return {
			verdict: PhishingCategory.Error,
			data: null,
		};
	});

	await insertPhishLog(db, {
		phishing_id,
		message: `Checked ${url} with ${sourceName}`,
	});

	await db('phishing_veredicts').insert({
		phishing_id,
		source: sourceName,
		status: checkResult.verdict,
	});

	return checkResult;
}
