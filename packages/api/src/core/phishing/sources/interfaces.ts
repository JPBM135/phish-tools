export enum PhishingCategory {
	Malicious = 'malicious',
	Unknown = 'unknown',
	Safe = 'safe',
}

export interface PhishingSource<T> {
	checkUrl(url: string): Promise<{
		verdict: PhishingCategory;
		data: T;
	}>;
}
