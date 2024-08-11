import { request } from 'undici';
import { OpenPhishSource } from './openPhish.js';
import cron from 'node-cron';
import { PhishingCategory } from '../interfaces.js';

export class OpenPhishUpdates {
	public static FEED_URL = 'https://openphish.com/feed.txt';

	private readonly parent: OpenPhishSource;

	public schedule: cron.ScheduledTask;

	private logger = OpenPhishSource.logger.createChildren('OpenPhishUpdates');

	public constructor(parent: OpenPhishSource) {
		this.parent = parent;

		// Run every day at midnight
		this.schedule = cron.schedule('0 0 * * *', () => {
			void this.fetchUpdates();
		});
	}

	public async fetchUpdates() {
		const response = await request(OpenPhishUpdates.FEED_URL);

		const data = await response.body.text();

		const urls = data.split('\n');

		for (const url of urls) {
			const exists = await this.parent.checkUrl(url);

			if (exists) {
				continue;
			}

			const database = await this.parent.getDbInstance();

			this.logger.info(`Adding new URL to database: ${url}`);

			await database('domains_cache').insert({
				url,
				category: PhishingCategory.Malicious,
				domain: new URL(url).hostname,
				source: OpenPhishSource.SOURCE_NAME,
			});
		}
	}
}
