export enum AbuseChSpamhausDbl {
	AbusedLegitBotnetcc = 'abused_legit_botnetcc',
	AbusedLegitMalware = 'abused_legit_malware',
	AbusedLegitPhishing = 'abused_legit_phishing',
	AbusedLegitSpam = 'abused_legit_spam',
	AbusedRedirector = 'abused_redirector',
	BotnetCcDomain = 'botnet_cc_domain',
	NotListed = 'not listed',
	PhishingDomain = 'phishing_domain',
	SpammerDomain = 'spammer_domain',
}

export enum AbuseChSurbl {
	Listed = 'listed',
	NotListed = 'not listed',
}

export enum AbuseChQueryStatus {
	HttpPostExpected = 'http_post_expected',
	InvalidHost = 'invalid_host',
	NoResults = 'no_results',
	Ok = 'ok',
}

export enum AbuseChUrlStatus {
	Offline = 'offline',
	Online = 'online',
	Unknown = 'unknown',
}

export interface AbuseChHostQuery {
	blacklists: {
		spamhaus_dbl: AbuseChSpamhausDbl;
		surbl: AbuseChSurbl;
	};
	firstseen: string;
	query_status: AbuseChQueryStatus;
	url_count: number;
	urlhaus_reference: string;
	urls: AbuseChUrlEntry[];
}

export interface AbuseChUrlEntry {
	date_added: string;
	id: string;
	larted: boolean;
	reporter: string;
	tags: string[];
	takedown_time_seconds: number | null;
	threat: 'malware_download';
	url_status: AbuseChUrlStatus;
	urlhaus_reference: string;
}
