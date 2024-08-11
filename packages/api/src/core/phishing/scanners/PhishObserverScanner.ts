import { request } from 'undici';
import type { PhishingScanner } from './interfaces.js';
import { config } from '../../../config.js';
import type { PhishObserverSubmissionResponse } from './PhishObserverScanner.types.js';
import { Timestamp } from '../../structures/Timestamp.js';

export interface PhishObserverJobSubmissionResponse {
	id: string;
}

export interface PhishObserverCheckResponse {
	isFinished: boolean;
	data: PhishObserverSubmissionResponse;
}

export class PhishObserverScanner
	implements
		PhishingScanner<
			PhishObserverJobSubmissionResponse,
			PhishObserverCheckResponse,
			PhishObserverSubmissionResponse
		>
{
	public static readonly SCANNER_NAME = 'phish_observer';

	public static readonly SCANNER_URL = 'https://phish.observer/api/';

	private static instance: PhishObserverScanner;

	public static getInstance() {
		return (this.instance ??= new PhishObserverScanner());
	}

	async submitJob(
		url: string,
	): Promise<{ job_id: string; data: PhishObserverJobSubmissionResponse }> {
		const response = await request(
			PhishObserverScanner.SCANNER_URL + 'submit',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${config.tokens.phishObserver}`,
				},
				body: JSON.stringify({
					url,
				}),
			},
		);

		if (response.statusCode !== 200) {
			throw new Error(
				`Failed to submit job to Phish Observer: ${response.statusCode}`,
			);
		}

		const body =
			(await response.body.json()) as PhishObserverSubmissionResponse;

		return {
			job_id: body.id,
			data: body,
		};
	}

	async checkJob(job_id: string): Promise<PhishObserverCheckResponse> {
		const body = await this.fetchJob(job_id);
		return {
			isFinished: body.status === 'complete',
			data: body,
		};
	}

	async fetchJob(job_id: string): Promise<PhishObserverSubmissionResponse> {
		const response = await request(
			PhishObserverScanner.SCANNER_URL + `submission/${job_id}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${config.tokens.phishObserver}`,
				},
			},
		);

		if (response.statusCode !== 200) {
			throw new Error(
				`Failed to fetch job to Phish Observer: ${response.statusCode}`,
			);
		}

		return (await response.body.json()) as PhishObserverSubmissionResponse;
	}

	backoffStrategy(attempt: number): number {
		if (attempt === 1) {
			return Timestamp.fromSeconds(10).toMilliseconds();
		}

		const backoff = Math.min(Math.pow(2, attempt), 15);
		return Timestamp.fromSeconds(backoff).toMilliseconds();
	}
}
