export interface UrlScanResult {
	data: UrlScanResultData;
	lists: UrlScanResultLists;
	meta: UrlScanResultMeta;
	page: UrlScanResultPage;
	scanner: UrlScanResultScanner;
	stats: UrlScanResultStats;
	submitter: UrlScanResultSubmitter;
	task: UrlScanResultTask;
	verdicts: UrlScanResultVerdicts;
}

export interface UrlScanResultData {
	requests: UrlScanResultHttpTransaction[];
	cookies: UrlScanResultCookie[];
	console: UrlScanResultConsoleMessage[];
	links: UrlScanResultLink[];
	timing: UrlScanResultTiming;
	globals: UrlScanResultGlobalVariable[];
}

export interface UrlScanResultCookie {
	name: string;
	value: string;
	domain: string;
	path: string;
	expires: number;
	size: number;
	httpOnly: boolean;
	secure: boolean;
	session: boolean;
	priority: string;
	sameParty: boolean;
	sourceScheme: string;
	sourcePort: number;
}

export interface UrlScanResultConsoleMessage {
	message: {
		source: string;
		level: string;
		text: string;
		url: string;
		timestamp: number;
	};
}

export interface UrlScanResultLink {
	href: string;
	text: string;
}

export interface UrlScanResultTiming {
	requestTime?: number;
	proxyStart?: number;
	proxyEnd?: number;
	dnsStart?: number;
	dnsEnd?: number;
	connectStart?: number;
	connectEnd?: number;
	sslStart?: number;
	sslEnd?: number;
	workerStart?: number;
	workerReady?: number;
	workerFetchStart?: number;
	workerRespondWithSettled?: number;
	sendStart?: number;
	sendEnd?: number;
	pushStart?: number;
	pushEnd?: number;
	receiveHeadersStart?: number;
	receiveHeadersEnd?: number;
}

export interface UrlScanResultGlobalVariable {
	prop: string;
	type: string;
}

export interface UrlScanResultHttpTransaction {
	request?: UrlScanResultRequestDetails;
	requests?: UrlScanResultRequestDetails[];
	response?: UrlScanResultResponse;
	initiatorInfo?: UrlScanResultInitiatorInfo;
}

export interface UrlScanResultRequestDetails {
	requestId: string;
	loaderId: string;
	documentURL: string;
	request: UrlScanResultRequestInfo;
	timestamp: number;
	wallTime: number;
	initiator: UrlScanResultInitiator;
	redirectHasExtraInfo: boolean;
	type: string;
	frameId: string;
	hasUserGesture: boolean;
}

export interface UrlScanResultRequestInfo {
	url: string;
	method: string;
	headers: UrlScanResultHeaders;
	mixedContentType: string;
	initialPriority: string;
	referrerPolicy: string;
	isSameSite: boolean;
}

export interface UrlScanResultHeaders {
	[header: string]: string;
}

export interface UrlScanResultInitiator {
	type: string;
	url?: string;
	stack?: UrlScanResultStack;
	lineNumber?: number;
	columnNumber?: number;
}

export interface UrlScanResultStack {
	callFrames: UrlScanResultCallFrame[];
}

export interface UrlScanResultCallFrame {
	functionName: string;
	scriptId: string;
	url: string;
	lineNumber: number;
	columnNumber: number;
}

export interface UrlScanResultResponse {
	encodedDataLength: number;
	dataLength: number;
	requestId: string;
	type: string;
	response: UrlScanResultResponseDetails;
	hasExtraInfo: boolean;
	hash?: string;
	size?: number;
	asn?: UrlScanResultAsn;
	geoip?: UrlScanResultGeoip;
	failed?: UrlScanResultFailed;
}

export interface UrlScanResultResponseDetails {
	url: string;
	status: number;
	statusText: string;
	headers: UrlScanResultResponseHeaders;
	mimeType: string;
	charset: string;
	remoteIPAddress?: string;
	remotePort?: number;
	encodedDataLength: number;
	timing?: UrlScanResultTiming;
	responseTime?: number;
	protocol: string;
	alternateProtocolUsage?: string;
	securityState: string;
	securityDetails?: UrlScanResultSecurityDetails;
	securityHeaders?: UrlScanResultSecurityHeader[];
}

export interface UrlScanResultResponseHeaders {
	date?: string;
	'x-hcdn-cache-status'?: string;
	server?: string;
	'x-hcdn-request-id'?: string;
	'content-type'?: string;
	'cache-control'?: string;
	'x-hcdn-image-optimizer'?: string;
	'x-hcdn-upstream-rt'?: string;
	'accept-ranges'?: string;
	'alt-svc'?: string;
	'content-length'?: string;
	'content-security-policy'?: string;
	'last-modified'?: string;
	'content-encoding'?: string;
	etag?: string;
	vary?: string;
	'x-turbo-charged-by'?: string;
	platform?: string;
	'Content-Type'?: string;
	age?: string;
	expires?: string;
	'x-content-type-options'?: string;
	'content-security-policy-report-only'?: string;
	'cross-origin-resource-policy'?: string;
	'x-xss-protection'?: string;
	'cross-origin-opener-policy'?: string;
	'report-to'?: string;
	'access-control-allow-origin'?: string;
	'timing-allow-origin'?: string;
	'Content-Length'?: string;
	'strict-transport-security'?: string;
	'x-frame-options'?: string;
	link?: string;
}

export interface UrlScanResultSecurityDetails {
	protocol: string;
	keyExchange: string;
	keyExchangeGroup: string;
	cipher: string;
	certificateId: number;
	subjectName: string;
	sanList: string[];
	issuer: string;
	validFrom: number;
	validTo: number;
	signedCertificateTimestampList: UrlScanResultSignedCertificateTimestamp[];
	certificateTransparencyCompliance: string;
	serverSignatureAlgorithm: number;
	encryptedClientHello: boolean;
}

export interface UrlScanResultSignedCertificateTimestamp {
	status: string;
	origin: string;
	logDescription: string;
	logId: string;
	timestamp: number;
	hashAlgorithm: string;
	signatureAlgorithm: string;
	signatureData: string;
}

export interface UrlScanResultSecurityHeader {
	name: string;
	value: string;
}

export interface UrlScanResultAsn {
	ip: string;
	asn: string;
	country: string;
	registrar: string;
	date: string;
	description: string;
	route: string;
	name: string;
}

export interface UrlScanResultGeoip {
	country: string;
	region: string;
	timezone: string;
	city: string;
	ll: number[];
	countryName: string;
	metro: number;
}

export interface UrlScanResultFailed {
	requestId: string;
	timestamp: number;
	type: string;
	errorText: string;
	canceled: boolean;
}

export interface UrlScanResultInitiatorInfo {
	url: string;
	host: string;
	type: string;
}

export interface UrlScanResultLists {
	ips: string[];
	countries: string[];
	asns: number[];
	domains: string[];
	servers: string[];
	urls: string[];
	linkDomains: string[];
	certificates: UrlScanResultCertificate[];
	hashes: string[];
}

export interface UrlScanResultCertificate {
	subjectName: string;
	issuer: string;
	validFrom: number;
	validTo: number;
}

export interface UrlScanResultMeta {
	processors: UrlScanResultProcessors;
}

export interface UrlScanResultProcessors {
	asn: {
		data: {
			ip: string;
			asn: string;
			country: string;
			registrar: string;
			date: string;
			description: string;
			route: string;
			name: string;
		}[];
	};
	download?: UrlScanResultDownload[];
	geoip: {
		data: {
			ip: string;
			geoip: {
				country: string;
				region: string;
				timezone: string;
				city: string;
				ll: number[];
				country_name: string;
				metro: number;
			};
		}[];
	};
	rdns: {
		data: {
			ip: string;
			ptr: string;
		}[];
	};
	umbrella: {
		data: {
			hostname: string;
			rank: number;
		}[];
	};
	wappa: {
		data: {
			confidence: {
				confidence: number;
				pattern: string;
			}[];
			confidenceTotal: number;
			app: string;
			icon: string;
			website: string;
			categories: {
				name: string;
				priority: number;
			}[];
		}[];
	};
}

export interface UrlScanResultDownload {
	filename: string;
	filesize: number;
	receivedBytes: number;
	url: string;
	startedAt: string;
	state: string;
	mimeType: string;
	mimeDescription: string;
	sha256: string;
	finishedAt: string;
}

export interface UrlScanResultPage {
	apexDomain: string;
	asnname: string;
	asn: string;
	city: string;
	country: string;
	domain: string;
	ip: string;
	mimeType: string;
	ptr: string;
	redirected: string;
	server: string;
	status: string;
	title: string;
	tlsAgeDays: number;
	tlsIssuer: string;
	tlsValidDays: number;
	tlsValidFrom: string;
	umbrellaRank: number;
	url: string;
}

export interface UrlScanResultScanner {
	country: string;
}

export interface UrlScanResultStats {
	IPv6Percentage: number;
	adBlocked: number;
	domainStats: UrlScanResultDomainStat[];
	ipStats: UrlScanResultIpStat[];
	malicious: number;
	protocolStats: UrlScanResultProtocolStat[];
	regDomainStats: UrlScanResultRegDomainStat[];
	resourceStats: UrlScanResultResourceStat[];
	securePercentage: number;
	secureRequests: number;
	serverStats: UrlScanResultServerStat[];
	tlsStats: UrlScanResultTlsStat[];
	totalLinks: number;
	uniqCountries: number;
}

export interface UrlScanResultDomainStat {
	count: number;
	ips: string[];
	domain: string;
	size: number;
	encodedSize: number;
	countries: string[];
	index: number;
	initiators: string[];
	redirects: number;
}

export interface UrlScanResultIpStat {
	requests: number;
	domains: string[];
	ip: string;
	asn: UrlScanResultAsn;
	dns: UrlScanResultDns;
	geoip: UrlScanResultGeoip;
	size: number;
	encodedSize: number;
	countries: string[];
	index: number;
	ipv6: boolean;
	redirects: number;
	count: any;
}

export interface UrlScanResultDns {}

export interface UrlScanResultProtocolStat {
	count: number;
	size: number;
	encodedSize: number;
	ips: string[];
	countries: string[];
	securityState: UrlScanResultSecurityState;
	protocol: string;
}

export interface UrlScanResultSecurityState {}

export interface UrlScanResultRegDomainStat {
	count: number;
	ips: string[];
	regDomain: string;
	size: number;
	encodedSize: number;
	countries: any[];
	index: number;
	subDomains: UrlScanResultSubDomain[];
	redirects: number;
}

export interface UrlScanResultSubDomain {
	domain: string;
	country: string;
}

export interface UrlScanResultResourceStat {
	count: number;
	size: number;
	encodedSize: number;
	latency: number;
	countries: string[];
	ips: string[];
	type: string;
	compression: string;
	percentage: number;
}

export interface UrlScanResultServerStat {
	count: number;
	size: number;
	encodedSize: number;
	ips: string[];
	countries: string[];
	server: string;
}

export interface UrlScanResultTlsStat {
	count: number;
	size: number;
	encodedSize: number;
	ips: string[];
	countries: string[];
	protocols: UrlScanResultProtocols;
	securityState: string;
}

export interface UrlScanResultProtocols {
	'TLS 1.3 /  / AES_128_GCM': number;
	'QUIC /  / AES_128_GCM': number;
}

export interface UrlScanResultSubmitter {
	country: string;
}

export interface UrlScanResultTask {
	apexDomain: string;
	domain: string;
	method: string;
	source: string;
	tags: any[];
	time: string;
	url: string;
	uuid: string;
	visibility: string;
	reportURL: string;
	screenshotURL: string;
	domURL: string;
}

export interface UrlScanResultVerdicts {
	overall: UrlScanResultOverall;
	urlscan: UrlScanResultUrlscan;
	engines: UrlScanResultEngines;
	community: UrlScanResultCommunity;
}

export interface UrlScanResultOverall {
	score: number;
	categories: string[];
	brands: string[];
	tags: string[];
	malicious: boolean;
	hasVerdicts: boolean;
}

export interface UrlScanResultUrlscan {
	score: number;
	categories: string[];
	brands: UrlScanResultCommunityBrand[];
	tags: string[];
	malicious: boolean;
	hasVerdicts: boolean;
}

export interface UrlScanResultEngines {
	score: number;
	categories: string[];
	enginesTotal: number;
	maliciousTotal: number;
	benignTotal: number;
	maliciousVerdicts: any[];
	benignVerdicts: any[];
	malicious: boolean;
}

export interface UrlScanResultCommunity {
	score: number;
	categories: any[];
	brands: UrlScanResultCommunityBrand[];
	votesTotal: number;
	votesMalicious: number;
	votesBenign: number;
	malicious: boolean;
	hasVerdicts: boolean;
}

export interface UrlScanResultCommunityBrand {
	key: string;
	name: string;
	country: string[];
	vertical: string[];
}

export interface UrlScanResultLabels {
	systemLabels: string[];
	userTags: string[];
	metaTags: string[];
}
