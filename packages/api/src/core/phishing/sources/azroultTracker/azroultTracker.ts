import { request } from 'undici';
import logger from '../../../../logger.js';
import { PhishingCategory, type PhishingSource } from '../interfaces.js';
import type { AzroultTrackerResponse } from './interfaces.js';

export class AzroultTrackerSource
	implements PhishingSource<AzroultTrackerResponse[]>
{
	public static readonly SOURCE_NAME = 'azroult_tracker';

	public static API_BASE_URL = 'https://azorult-tracker.net/api/domain/';

	public static logger = logger.createChildren('AzroultTrackerSource');

	private static instance: AzroultTrackerSource;

	public static getInstance() {
		return (this.instance ??= new AzroultTrackerSource());
	}

	public async checkUrl(domain: string): Promise<{
		verdict: PhishingCategory;
		data: AzroultTrackerResponse[] | null;
	}> {
		const response = await request(
			`${AzroultTrackerSource.API_BASE_URL}${domain}`,
			{
				method: 'GET',
			},
		);

		if (response.statusCode !== 200) {
			return {
				verdict: PhishingCategory.Unknown,
				data: null,
			};
		}

		const data = (await response.body.json()) as AzroultTrackerResponse[];

		return {
			verdict:
				data.length > 0 ? PhishingCategory.Malicious : PhishingCategory.Unknown,
			data: data,
		};
	}
}
