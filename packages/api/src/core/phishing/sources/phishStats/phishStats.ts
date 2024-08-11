import {
	PhishingCategory,
	type PhishingSource,
	type PhishingSourceCheckUrlResponse,
} from '../interfaces.js';
import type { PhishStatsResponse } from './interface.js';
import logger from '../../../../logger.js';
import { request } from 'undici';

export class PhishStatsSource implements PhishingSource<PhishStatsResponse[]> {
	public static readonly SOURCE_NAME = 'open_phish';

	public static logger = logger.createChildren('PhishStatsSource');

	private static instance: PhishStatsSource;

	public static getInstance() {
		return (this.instance ??= new PhishStatsSource());
	}

	async checkUrl(
		url: string,
	): Promise<PhishingSourceCheckUrlResponse<PhishStatsResponse[]>> {
		const urlObject = new URL(url);

		const urlSearchParams = new URLSearchParams();
		urlSearchParams.append(
			'_where',
			[`(url,eq,${url})`, `(host,eq,${urlObject.hostname})`].join('~or'),
		);

		const response = await request(
			'https://phishstats.info:2096/api/phishing?' + urlSearchParams.toString(),
		);

		const data = (await response.body.json()) as PhishStatsResponse[];

		if (data.length === 0) {
			return {
				verdict: PhishingCategory.Unknown,
				data: null,
			};
		}

		const phishStatsResponse = data.filter((phishStatsResponse) => {
			const sanitizedUrl = new URL(phishStatsResponse.url);

			return (
				sanitizedUrl.hostname === urlObject.hostname &&
				sanitizedUrl.pathname === urlObject.pathname
			);
		});

		if (phishStatsResponse.length === 0) {
			return {
				verdict: PhishingCategory.Unknown,
				data: null,
			};
		}

		return {
			verdict: PhishingCategory.Malicious,
			data: phishStatsResponse,
		};
	}
}
