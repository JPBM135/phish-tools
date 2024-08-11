import {
	PhishingCategory,
	type PhishingSource,
	type PhishingSourceCheckUrlResponse,
} from '../interfaces.js';
import logger from '../../../../logger.js';
import { request } from 'undici';

interface NabpListResponse {
	result: string;
	url: string;
}

export class NabpListSource implements PhishingSource<NabpListResponse> {
	public static readonly SOURCE_NAME = 'nabp_list';

	public static logger = logger.createChildren('NabpListSource');

	private static instance: NabpListSource;

	public static getInstance() {
		return (this.instance ??= new NabpListSource());
	}

	async checkUrl(
		url: string,
	): Promise<PhishingSourceCheckUrlResponse<NabpListResponse>> {
		const urlSearchParams = new URLSearchParams();
		urlSearchParams.append('ur;', url);

		const response = await request(
			'hhttps://safe.pharmacy/wp-content/themes/safe24/ddl/vuvl.php?' +
				urlSearchParams.toString(),
		);

		const data = (await response.body.json()) as NabpListResponse;

		return {
			verdict:
				data.result === 'unknown'
					? PhishingCategory.Unknown
					: PhishingCategory.Malicious,
			data,
		};
	}
}
