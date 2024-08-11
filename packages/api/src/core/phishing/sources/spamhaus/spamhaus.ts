import logger from '../../../../logger.js';
import { SpamhausAuth } from './auth.js';
import type {
	SpamhausCompleteDomainData,
	SpamhausDomainContext,
	SpamhausDomainData,
	SpamhausDomainDimension,
} from './interfaces.js';
import { SpamhausDataStore } from './store.js';

export class SpamhausSource {
	public static API_BASE_URL = 'https://api.spamhaus.org/api';

	public static logger = logger.createChildren('SpamhausSource');

	private static instance: SpamhausSource;

	public static getInstance(): SpamhausSource {
		return (this.instance ??= new SpamhausSource());
	}

	public cache = new Map<string, SpamhausCompleteDomainData>();

	private readonly auth: SpamhausAuth;

	private readonly store: SpamhausDataStore;

	private constructor() {
		this.auth = new SpamhausAuth();
		this.store = new SpamhausDataStore(this.auth);
		void this.store.fetchDataStores();
	}

	public async checkDomain(domain: string): Promise<SpamhausCompleteDomainData | null> {
		console.log('checkDomain', domain);
		return null;
	}

	public async getDomain(domain: string): Promise<SpamhausCompleteDomainData | null> {
		if (this.cache.has(domain)) {
			return this.cache.get(domain)!;
		}

		const response = await this.auth.fetchUrl<SpamhausDomainData>(`/intel/v2/byobject/domain/${domain}`);
		if (!response) return null;

		const [dimensions, contexts] = await Promise.all([
			this.auth.fetchUrl<SpamhausDomainDimension>(`/intel/v2/byobject/domain/${domain}/dimensions`),
			this.auth.fetchUrl<SpamhausDomainContext[]>(`/intel/v2/byobject/domain/${domain}/contexts`),
		]);
		return this.transformDomainData({ domainData: response, dimensions, contexts });
	}

	private transformDomainData({
		domainData,
		dimensions,
		contexts,
	}: {
		contexts: SpamhausDomainContext[] | null;
		dimensions: SpamhausDomainDimension | null;
		domainData: SpamhausDomainData;
	}): SpamhausCompleteDomainData {
		return {
			abused: domainData.abused,
			clusters: domainData.clusters,
			deactivatedTs: domainData['deactivated-ts'],
			domain: domainData.domain,
			lastSeen: domainData['last-seen'],
			score: domainData.score,
			whois: domainData.whois,
			dimensions: this.store.transformDimensions(dimensions ?? {}),
			contexts: this.store.transformContexts(contexts ?? []),
			tags: this.store.transformTags(domainData.tags),
		};
	}
}
