import { config } from '../../../config.js';
import { Timestamp } from '../../structures/Timestamp.js';
import type { CloudflareRadarScannerResponse } from './CloudflareRadarScanner.types.js';
import type { PhishingScanner } from './interfaces.js';
import { request } from 'undici';

export interface CloudflareRadarJobSubmissionResponse {
	errors: {
		message: string;
	}[];
	messages: {
		message: string;
	}[];
	result: {
		time: string;
		url: string;
		uuid: string;
		visibility: string;
	};
	success: boolean;
}

export interface CloudflareRadarJobCheckResponse {
	isFinished: boolean;
	data: CloudflareRadarScannerResponse['result']['scan']['task'];
}

export class CloudflareRadarScanner
	implements
		PhishingScanner<
			CloudflareRadarJobSubmissionResponse,
			CloudflareRadarJobCheckResponse,
			CloudflareRadarScannerResponse
		>
{
	public static readonly SCANNER_NAME = 'cloudflare-radar';

	public static readonly SCANNER_URL = `https://api.cloudflare.com/client/v4/accounts/${config.tokens.cloudFlare.accountId}/urlscanner/scan`;

	async submitJob(url: string): Promise<{ job_id: string; data: CloudflareRadarJobSubmissionResponse }> {
		const response = await request(CloudflareRadarScanner.SCANNER_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': config.tokens.cloudFlare.token,
			},
			body: JSON.stringify({
				screenshotsResolutions: ['desktop', 'mobile', 'tablet'],
				url: url,
				visibility: 'Public',
			}),
		});

		if (response.statusCode !== 200) {
			throw new Error(`Failed to submit job to Cloudflare Radar: ${response.statusCode}`);
		}

		const body = (await response.body.json()) as CloudflareRadarJobSubmissionResponse;

		if (!body.success || body.errors.length) {
			throw new Error(`Failed to submit job to Cloudflare Radar: ${body.errors[0]?.message ?? 'Unknown error'}`);
		}

		return {
			job_id: body.result.uuid,
			data: body,
		};
	}

	async checkJob(job_id: string): Promise<CloudflareRadarJobCheckResponse> {
		const response = await request(`${CloudflareRadarScanner.SCANNER_URL}/${job_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': config.tokens.cloudFlare.token,
			},
		});

		if (response.statusCode !== 200 && response.statusCode !== 202) {
			throw new Error(`Failed to check job on Cloudflare Radar: ${response.statusCode}`);
		}

		const body = (await response.body.json()) as CloudflareRadarScannerResponse;

		return {
			isFinished: response.statusCode === 200,
			data: body.result.scan.task,
		};
	}

	async fetchJob(job_id: string): Promise<CloudflareRadarScannerResponse> {
		const response = await request(`${CloudflareRadarScanner.SCANNER_URL}/${job_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': config.tokens.cloudFlare.token,
			},
		});

		if (response.statusCode !== 200) {
			throw new Error(`Failed to fetch job from Cloudflare Radar: ${response.statusCode}`);
		}

		return (await response.body.json()) as CloudflareRadarScannerResponse;
	}

	backoffStrategy(_: number): number {
		return Timestamp.fromSeconds(5).toMilliseconds();
	}
}
