import { setTimeout, setInterval, clearInterval } from 'node:timers';
import { request } from 'undici';
import { FishFishSource } from './fishFish.js';
import { config } from '../../../../config.js';

export interface CreateTokenResponseBody {
	expires: number;
	id: string;
	token: string;
}

export interface FishFishSessionToken {
	expires: Date;
	permissions: unknown[];
	token: string;
}

export interface FishFishAuthOptions {
	apiKey?: string;
	debug?: boolean;
}

export class FishFishAuth {
	private readonly logger =
		FishFishSource.logger.createChildren('FishFishAuth');

	/**
	 * The API key used to authenticate requests.
	 */
	private readonly apiKey: string;

	private _processing: boolean = false;

	private _sessionToken:
		| (Omit<FishFishSessionToken, 'expires'> & { expires: number })
		| null;

	public constructor() {
		this.apiKey = config.tokens.fishFish;
		this._sessionToken = null;
	}

	public get sessionToken() {
		return this._sessionToken
			? this._transformSessionToken(this._sessionToken)
			: null;
	}

	public get hasSessionToken() {
		return Boolean(this._sessionToken);
	}

	public async createSessionToken(): Promise<FishFishSessionToken> {
		if (this._sessionToken) {
			this.logger.debug('Session token already exist, returning it.');
			return this._transformSessionToken(this._sessionToken);
		}

		if (this._processing) {
			return new Promise((resolve) => {
				const interval = setInterval(() => {
					if (this._sessionToken) {
						clearInterval(interval);
						resolve(this._transformSessionToken(this._sessionToken));
					}
				}, 10);
			});
		}

		this._processing = true;
		try {
			const response = await request(
				`${FishFishSource.API_BASE_URL}/users/@me/tokens`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: this.apiKey,
					},
					body: JSON.stringify({}),
				},
			);

			if (response.statusCode !== 200) {
				throw new Error(
					`Failed to create session token. Status: ${response.statusCode}`,
				);
			}

			const token = (await response.body.json()) as CreateTokenResponseBody;

			this._sessionToken = {
				...token,
				permissions: [],
			};

			this._createExpireTimeout();

			this.logger.debug('Created session token.', {
				expire: this._sessionToken.expires * 1_000,
			});

			return this._transformSessionToken(this._sessionToken);
		} finally {
			this._processing = false;
		}
	}

	private _createExpireTimeout() {
		setTimeout(() => {
			this._sessionToken = null;
		}, (this._sessionToken?.expires ?? 0) * 1_000 - Date.now());
	}

	private _transformSessionToken(
		token: Omit<FishFishSessionToken, 'expires'> & { expires: number },
	): FishFishSessionToken {
		return {
			token: token.token,
			expires: new Date(Number(token.expires) * 1_000),
			permissions: token.permissions,
		};
	}
}
