export interface PhishingScanner<
	S,
	C extends {
		isFinished: boolean;
	},
	F,
> {
	submitJob(url: string): Promise<{
		job_id: string;
		data: S;
	}>;

	checkJob(job_id: string): Promise<C>;

	fetchJob(job_id: string): Promise<F>;

	/**
	 * @param attempt The number of attempts that have been made to fetch the job
	 * @returns The number of milliseconds to wait before the next attempt
	 */
	backoffStrategy(attempt: number): number;
}
