import { FormData, request } from 'undici';
import logger from '../../../../logger.js';
import { AbuseChQueryStatus, type AbuseChHostQuery } from './interfaces.js';

export class AbuseChSource {
	private static readonly logger = logger.createChildren('AbuseChSource');

	public static API_BASE_URL = 'https://urlhaus-api.abuse.ch/v1';

	private static instance: AbuseChSource;

	public static getInstance() {
		return (this.instance ??= new AbuseChSource());
	}

	public async checkDomain(domain: string): Promise<AbuseChHostQuery | null> {
		const formData = new FormData();
		formData.append('host', domain);

		const response = await request(AbuseChSource.API_BASE_URL + `/host`, {
			method: 'POST',
			body: formData,
		});

		if (response.statusCode !== 200) {
			return null;
		}

		const data = (await response.body.json()) as AbuseChHostQuery;

		if (data.query_status !== AbuseChQueryStatus.Ok) {
			AbuseChSource.logger.warn(`Failed to query AbuseCh for domain ${domain}: ${data.query_status}`);
			return null;
		}

		return data;
	}
}
