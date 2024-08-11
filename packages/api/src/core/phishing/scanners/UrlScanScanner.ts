import { request } from 'undici';
import type { PhishingScanner } from './interfaces.js';
import { config } from '../../../config.js';
import type { UrlScanResult } from './UrlScanScanner.types.js';
import { Timestamp } from '../../structures/Timestamp.js';

interface UrlScanJobSubmissionResponse {
	message: 'Submission successful';
	uuid: '0e37e828-a9d9-45c0-ac50-1ca579b86c72';
	result: 'https://urlscan.io/result/0e37e828-a9d9-45c0-ac50-1ca579b86c72/';
	api: 'https://urlscan.io/api/v1/result/0e37e828-a9d9-45c0-ac50-1ca579b86c72/';
	visibility: 'public';
	options: {
		useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36';
	};
	url: 'https://urlscan.io';
	country: 'de';
}

interface UrlScanJobCheckResponse {
	isFinished: boolean;
	data: {
		job_id: string;
	};
}

export class UrlScanScanner
	implements PhishingScanner<UrlScanJobSubmissionResponse, UrlScanJobCheckResponse, UrlScanResult>
{
	public static readonly SCANNER_NAME = 'urlscan';

	public static readonly SCANNER_URL = 'https://urlscan.io/api/v1/';

	async submitJob(url: string): Promise<{ job_id: string; data: UrlScanJobSubmissionResponse }> {
		const result = await request(UrlScanScanner.SCANNER_URL + 'scan', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'API-Key': config.tokens.urlScan,
			},
			body: JSON.stringify({
				url,
				visibility: 'public',
			}),
		});

		if (result.statusCode !== 200) {
			throw new Error(`Failed to submit job to UrlScan: ${result.statusCode}`);
		}

		const body = (await result.body.json()) as UrlScanJobSubmissionResponse;

		return {
			job_id: body.uuid,
			data: body,
		};
	}

	async checkJob(job_id: string): Promise<UrlScanJobCheckResponse> {
		const result = await request(UrlScanScanner.SCANNER_URL + 'result/' + job_id, {
			method: 'GET',
			headers: {
				'API-Key': config.tokens.urlScan,
			},
		});

		return {
			isFinished: result.statusCode === 200,
			data: {
				job_id,
			},
		};
	}

	async fetchJob(job_id: string): Promise<UrlScanResult> {
		const result = await request(UrlScanScanner.SCANNER_URL + 'result/' + job_id, {
			method: 'GET',
			headers: {
				'API-Key': config.tokens.urlScan,
			},
		});

		if (result.statusCode !== 200) {
			throw new Error(`Failed to fetch job to UrlScan: ${result.statusCode}`);
		}

		return result.body.json() as Promise<UrlScanResult>;
	}

	backoffStrategy(attempt: number): number {
		if (attempt === 1) {
			return Timestamp.fromSeconds(10).toMilliseconds();
		}

		return Timestamp.fromSeconds(5).toMilliseconds();
	}
}
