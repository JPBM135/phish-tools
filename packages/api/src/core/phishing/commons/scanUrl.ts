import type { Knex } from 'knex';
import { insertPhishLog } from '../../logs/insertPhishLog.js';
import { SCANNERS } from '../index.js';
import logger from '../../../logger.js';
import type { PhishingScanner } from '../scanners/interfaces.js';

const childLogger = logger.createChildren('scanUrl');

export async function scanUrl(
	scannerName: keyof typeof SCANNERS,
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
	const source = SCANNERS[scannerName];
	const sourceInstance = source.getInstance();

	const checkResult = await sourceInstance
		.submitJob(url)
		.catch(async (error) => {
			childLogger.error(error);
			await insertPhishLog(db, {
				phishing_id,
				message: `Failed to submit scan to ${url} with ${scannerName}`,
			});

			return null;
		});

	if (!checkResult) {
		return;
	}

	await insertPhishLog(db, {
		phishing_id,
		message: `Started scanning ${url} with ${scannerName}`,
	});

	const [scan] = await db('phishing_scans')
		.insert({
			phishing_id,
			source: scannerName,
			scan_id: checkResult.job_id,
		})
		.returning('*');

	void checkScanned(
		sourceInstance,
		scannerName,
		checkResult.job_id,
		phishing_id,
		db,
		url,
		scan!.id,
	);
}

async function checkScanned(
	sourceInstance: PhishingScanner<unknown, any, unknown>,
	scannerName: string,
	job_id: string,
	phishing_id: string,
	db: Knex,
	url: string,
	scan_id: string,
) {
	let isFinished = false;

	for (let i = 0; i < 20; i++) {
		const jobStatus = await sourceInstance.checkJob(job_id);
		childLogger.debug(`[${scannerName}] Job ${job_id}, attempt ${i + 1}`);
		if (jobStatus.isFinished) {
			isFinished = true;
			await db('phishing_scans').where('id', scan_id).update({
				status: 'success',
			});

			await insertPhishLog(db, {
				phishing_id,
				message: `Finished scanning ${url} with ${scannerName}`,
				metadata: {
					scan_id: job_id,
				},
			});
			break;
		}

		await new Promise((resolve) =>
			setTimeout(resolve, sourceInstance.backoffStrategy(i + 1)),
		);
	}

	if (!isFinished) {
		await db('phishing_scans').where('id', scan_id).update({
			status: 'failed',
		});

		await insertPhishLog(db, {
			phishing_id,
			message: `Timeout while scanning ${url} with ${scannerName}`,
			metadata: {
				scan_id: job_id,
			},
		});
	}
}
