import type { SpamhausAuth } from './auth.js';
import type { SpamhausDomainContext, SpamhausDomainDimension } from './interfaces.js';
import { SpamhausSource } from './spamhaus.js';

export class SpamhausDataStore {
	private logger = SpamhausSource.logger.createChildren('SpamhausDataStore');

	public readonly tlds = new Set<string>();

	public readonly tags = new Map<
		string,
		{
			description: string;
			tag: string;
		}
	>();

	public readonly contexts = new Map<
		string,
		{
			context: string;
			description: string;
		}
	>();

	public readonly domainDimensions = new Map<
		string,
		{
			description: string;
			dimension: string;
		}
	>();

	private readonly auth: SpamhausAuth;

	public constructor(auth: SpamhausAuth) {
		this.auth = auth;
	}

	public async fetchDataStores() {
		const [tlds, tags, contexts, domainDimensions] = await Promise.all([
			this.auth.fetchUrl<string[]>('/intel/v2/domains/tld'),
			this.auth.fetchUrl<{ description: string; tag: string }[]>('/intel/v2/domains/tags'),
			this.auth.fetchUrl<{ context: string; description: string }[]>('/intel/v2/domains/contexts'),
			this.auth.fetchUrl<{ description: string; dimension: string }[]>('/intel/v2/domains/dimensions'),
		]);

		if (tlds) {
			this.logger.info(`Fetched ${tlds.length} TLDs from Spamhaus`);
			for (const tld of tlds) {
				this.tlds.add(tld);
			}
		}

		if (tags) {
			this.logger.info(`Fetched ${tags.length} tags from Spamhaus`);
			for (const tag of tags) {
				this.tags.set(tag.tag, tag);
			}
		}

		if (contexts) {
			this.logger.info(`Fetched ${contexts.length} contexts from Spamhaus`);
			for (const context of contexts) {
				this.contexts.set(context.context, context);
			}
		}

		if (domainDimensions) {
			this.logger.info(`Fetched ${domainDimensions.length} domain dimensions from Spamhaus`);
			for (const dimension of domainDimensions) {
				this.domainDimensions.set(dimension.dimension, dimension);
			}
		}
	}

	public transformTags(tags: string[]) {
		return tags.map((tag) => {
			const tagData = this.tags.get(tag);
			return {
				tag,
				description: tagData?.description ?? 'No description available',
			};
		});
	}

	public transformContexts(contexts: SpamhausDomainContext[]) {
		return contexts.map((context) => {
			const contextData = this.contexts.get(context.context);
			return {
				context: context.context,
				lastSeen: context['last-seen'],
				description: contextData?.description ?? 'No description available',
			};
		});
	}

	public transformDimensions(dimensions: SpamhausDomainDimension) {
		return Object.entries(dimensions).map(([dimension, value]) => {
			const dimensionData = this.domainDimensions.get(dimension);
			return {
				dimension,
				description: dimensionData?.description ?? 'No description available',
				value,
			};
		});
	}
}
