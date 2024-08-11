import type { PhishingScanner } from './interfaces.js';

export class PhishReportScanner
	implements
		PhishingScanner<
			unknown,
			{
				isFinished: boolean;
			},
			unknown
		>
{
	submitJob(_: string): Promise<{ job_id: string; data: unknown }> {
		throw new Error('Method not implemented.');
	}

	checkJob(_: string): Promise<{
		isFinished: boolean;
	}> {
		throw new Error('Method not implemented.');
	}

	fetchJob(_: string): Promise<unknown> {
		throw new Error('Method not implemented.');
	}

	backoffStrategy(_: number): number {
		throw new Error('Method not implemented.');
	}
}
