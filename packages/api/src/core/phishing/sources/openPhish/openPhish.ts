import type { Knex } from 'knex';
import type { DomainsCache } from '../../../../@types/phishtools.schema.js';
import {
	PhishingCategory,
	type PhishingSource,
	type PhishingSourceCheckUrlResponse,
} from '../interfaces.js';
import { createDatabase } from '../../../database/createDatabase.js';
import logger from '../../../../logger.js';
import { OpenPhishUpdates } from './updates.js';

export class OpenPhishSource implements PhishingSource<DomainsCache> {
	public static readonly SOURCE_NAME = 'open_phish';

	private dbInstance: Knex | null = null;

	public static logger = logger.createChildren('OpenPhishSource');

	private updates = new OpenPhishUpdates(this);

	private static instance: OpenPhishSource;

	public static getInstance() {
		return (this.instance ??= new OpenPhishSource());
	}

	private constructor() {
		this.updates.fetchUpdates();
	}

	async getDbInstance() {
		if (!this.dbInstance) {
			const { db } = await createDatabase();
			this.dbInstance = db;
		}

		return this.dbInstance;
	}

	async checkUrl(
		url: string,
	): Promise<PhishingSourceCheckUrlResponse<DomainsCache>> {
		const db = await this.getDbInstance();

		const openPhishUrlQuery = db('domains_cache').where('url', url);

		try {
			openPhishUrlQuery.orWhere('domain', new URL(url).hostname);
		} catch (error) {
			OpenPhishSource.logger.error(
				`Failed to parse URL ${url} for hostname: ${error}`,
			);
		}

		const openPhishUrl = await openPhishUrlQuery.first();

		if (!openPhishUrl) {
			return {
				verdict: PhishingCategory.Unknown,
				data: null,
			};
		}

		return {
			verdict: PhishingCategory.Malicious,
			data: openPhishUrl,
		};
	}
}
