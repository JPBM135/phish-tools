export interface CheckPhishAiResponse {
	job_id: string;
	status: string;
	url: string;
	url_sha256: string;
	disposition: string;
	brand: string;
	insights: string;
	resolved: boolean;
	screenshot_path: string;
	scan_start_ts: number;
	scan_end_ts: number;
	categories: {
		score: number;
		threshold: number;
		category: string;
	}[];
}
