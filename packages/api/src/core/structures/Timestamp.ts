export class Timestamp {
	public static SECOND_IN_MILLISECONDS = 1000;
	public static MINUTE_IN_MILLISECONDS = 60 * Timestamp.SECOND_IN_MILLISECONDS;
	public static HOUR_IN_MILLISECONDS = 60 * Timestamp.MINUTE_IN_MILLISECONDS;
	public static DAY_IN_MILLISECONDS = 24 * Timestamp.HOUR_IN_MILLISECONDS;

	private readonly _timestampMilliseconds: number;

	private constructor(timestampMilliseconds: number) {
		this._timestampMilliseconds = timestampMilliseconds;
	}

	public static fromMilliseconds(milliseconds: number): Timestamp {
		return new Timestamp(milliseconds);
	}

	public static fromSeconds(seconds: number): Timestamp {
		return new Timestamp(seconds * Timestamp.SECOND_IN_MILLISECONDS);
	}

	public static fromHours(hours: number): Timestamp {
		return new Timestamp(hours * Timestamp.HOUR_IN_MILLISECONDS);
	}

	public static fromDays(days: number): Timestamp {
		return new Timestamp(days * Timestamp.DAY_IN_MILLISECONDS);
	}

	public toMilliseconds(): number {
		return this._timestampMilliseconds;
	}

	public toSeconds(round = false): number {
		return this.conditionalRound(this._timestampMilliseconds / Timestamp.SECOND_IN_MILLISECONDS, round);
	}

	public toHours(round = false): number {
		return this.conditionalRound(this._timestampMilliseconds / Timestamp.HOUR_IN_MILLISECONDS, round);
	}

	public toDays(round = false): number {
		return this.conditionalRound(this._timestampMilliseconds / Timestamp.DAY_IN_MILLISECONDS, round);
	}

	private conditionalRound(value: number, round: boolean): number {
		return round ? Math.round(value) : value;
	}
}
