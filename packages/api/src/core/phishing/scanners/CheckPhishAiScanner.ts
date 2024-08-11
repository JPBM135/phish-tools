import { request } from 'undici';
import { config } from '../../../config.js';
import type { PhishingScanner } from './interfaces.js';
import type { CheckPhishAiResponse } from './CheckPhishAiScanner.types.js';
import { Timestamp } from '../../structures/Timestamp.js';

interface CheckPhishAiJobSubmissionResponse {
	jobID: string;
	timestamp: number;
}

interface CheckPhishAiJobCheckResponse {
	isFinished: boolean;
	data: CheckPhishAiResponse;
}

export class CheckPhishAiScanner
	implements
		PhishingScanner<
			CheckPhishAiJobSubmissionResponse,
			CheckPhishAiJobCheckResponse,
			CheckPhishAiResponse
		>
{
	public static readonly SCANNER_NAME = 'check_phish_ai';

	public static readonly SCANNER_URL = 'https://developers.checkphish.ai/api/';

	private static instance: CheckPhishAiScanner;

	public static getInstance() {
		return (this.instance ??= new CheckPhishAiScanner());
	}

	async submitJob(
		url: string,
	): Promise<{ job_id: string; data: CheckPhishAiJobSubmissionResponse }> {
		const response = await request(
			CheckPhishAiScanner.SCANNER_URL + 'neo/scan',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					apiKey: config.tokens.checkPhishAI,
					urlInfo: { url: url },
					scanType: 'full',
				}),
			},
		);

		if (response.statusCode !== 200) {
			throw new Error(
				`Failed to submit job to CheckPhishAI: ${response.statusCode}`,
			);
		}

		const body =
			(await response.body.json()) as CheckPhishAiJobSubmissionResponse;

		return {
			job_id: body.jobID,
			data: body,
		};
	}

	async checkJob(job_id: string): Promise<CheckPhishAiJobCheckResponse> {
		const response = await request(
			CheckPhishAiScanner.SCANNER_URL + `neo/scan/status`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					apiKey: config.tokens.checkPhishAI,
					jobID: job_id,
					insights: true,
				}),
			},
		);

		const body = (await response.body.json()) as CheckPhishAiResponse;

		return {
			isFinished: body.status === 'DONE',
			data: body,
		};
	}

	async fetchJob(job_id: string): Promise<CheckPhishAiResponse> {
		const response = await request(
			CheckPhishAiScanner.SCANNER_URL + `neo/scan/status`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					apiKey: config.tokens.checkPhishAI,
					jobID: job_id,
					insights: true,
				}),
			},
		);

		if (response.statusCode !== 200) {
			throw new Error(
				`Failed to fetch job from CheckPhishAI: ${response.statusCode}`,
			);
		}

		const body = (await response.body.json()) as CheckPhishAiResponse;

		return body;
	}

	backoffStrategy(attempt: number): number {
		if (attempt === 1) {
			return Timestamp.fromSeconds(10).toMilliseconds();
		}

		const backoff = Math.min(Math.pow(2, attempt), 15);
		return Timestamp.fromSeconds(backoff).toMilliseconds();
	}
}
