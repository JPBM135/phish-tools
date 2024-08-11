export interface PhishObserverSubmissionResponse {
	id: string;
	url: string;
	favicon: string;
	effectiveUrl: string;
	realDomain: string;
	parsedDomain: string;
	status: string;
	screenshot: string;
	mobileScreenshot: string;
	errorReason: string;
	api: boolean;
	node: string;
	timeline: Array<PhishObserverSubmissionResponseTimelineEvent>;
	createdAt: string;
	assets: PhishObserverSubmissionResponseAssets;
	dns: PhishObserverSubmissionResponseDNS;
	abuseContacts: Array<PhishObserverSubmissionResponseAbuseContact>;
	tags: Array<string>;
	scan: PhishObserverSubmissionResponseScan;
}

export interface PhishObserverSubmissionResponseTimelineEvent {
	event: string;
	timestamp: string;
}

export interface PhishObserverSubmissionResponseAssets {
	count: number;
	url: string;
}

export interface PhishObserverSubmissionResponseDNS {
	count: number;
	records: Array<PhishObserverSubmissionResponseDNSRecord>;
}

export interface PhishObserverSubmissionResponseDNSRecord {
	type: string;
	// different for every DNS record
}

export interface PhishObserverSubmissionResponseAbuseContact {
	asn: number;
	aso: string;
	contacts: Array<string>;
	type: string;
}

export interface PhishObserverSubmissionResponseScan {
	status: string;
	iok: Array<PhishObserverSubmissionResponseScanIOK>;
}

export interface PhishObserverSubmissionResponseScanIOK {
	kit: PhishObserverSubmissionResponseScanKit;
}

export interface PhishObserverSubmissionResponseScanKit {
	tags: Array<string>;
	sortedTags: Array<string>;
	name: string;
}
