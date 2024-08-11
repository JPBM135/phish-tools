export enum PhishingCategory {
	Malicious = 'malicious',
	Unknown = 'unknown',
	Safe = 'safe',
	Error = 'error',
}

export interface PhishingSourceCheckUrlResponse<T> {
	verdict: PhishingCategory;
	data: T | null;
}

export interface PhishingSource<T> {
	checkUrl(url: string): Promise<PhishingSourceCheckUrlResponse<T>>;
}
