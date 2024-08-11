export interface SpamhausDomainData {
	/**
	 * Where the value returned is “true” this indicates the legitimate domain has been compromised.
	 */
	abused: boolean;
	/**
	 * Hashes that correlate multiple domains that share similar patterns; including email authentication
	 * and registration/infrastructure.
	 */
	clusters: Record<string, string>;
	/**
	 * The UNIX timestamp, if available, when the domain delegation disappeared from the root zone,
	 * either because the domain has expired or has been suspended from the registrar.
	 */
	'deactivated-ts': number;
	/**
	 * The domain name queried.
	 */
	domain: string;
	/**
	 * The UNIX timestamp of the last time our automation or our researchers observed the domain.
	 */
	'last-seen': number;
	/**
	 * This is the value of all the reputation dimensions combined. Zero is the neutral point, the higher
	 * the positive number; the greater the positive reputation of the domain, and conversely, the higher
	 * the negative score, the greater the negative reputation.
	 */
	score: number;
	/**
	 * Multiple tags can be attributed to a domain. These can be related to abuse associated with the domain,
	 * what type of domain it is or what it hosts, e.g., “phishing” or “redirector”.
	 */
	tags: string[];
	/**
	 * WHOIS information:
	 * - created: The date the domain was registered.
	 * - expires: The date the domain is due to expire.
	 * - registrar: The domain’s registrar.
	 */
	whois: {
		created: number;
		expires: number;
		registrar: string;
	};
}

export interface SpamhausDomainContext {
	context: string;
	'last-seen': number;
}

export type SpamhausDomainDimension = Record<string, number>;

export interface SpamhausCompleteDomainData {
	abused: boolean;
	clusters: Record<string, string>;
	contexts: {
		context: string;
		description: string;
		lastSeen: number;
	}[];
	deactivatedTs: number;
	dimensions: {
		description: string;
		dimension: string;
		value: number;
	}[];
	domain: string;
	lastSeen: number;
	score: number;
	tags: {
		description: string;
		tag: string;
	}[];
	whois: {
		created: number;
		expires: number;
		registrar: string;
	};
}

export interface SpamhausURLIdPayload {
	url: string;
}

export interface SpamhausURLIdResponse {
	id: string;
}

export interface SpamhausUrlPayload {
	file_ext: string;
	file_name: string;
	file_size: number;
	file_type: string;
	malware_family: string;
	mime_type: string;
	sha256_hash: string;
	ts: number;
}

export interface SpamhausUrlStatus {
	removal: string;
	reporter: string;
	status: string;
	ts: number;
}

export type SpamhausUrlLastStatusPayload = SpamhausURLIdPayload;

export interface SpamhausUrlLastStatusResponse {
	id: number;
	payload: SpamhausUrlPayload;
	status: SpamhausUrlStatus;
	url: string;
}

export type SpamhausUrlHistoryPayload = SpamhausURLIdPayload;

export interface SpamhausUrlHistoryResponse {
	events: SpamhausUrlStatus[];
	id: number;
	payloads: SpamhausUrlPayload[];
	url: string;
}
