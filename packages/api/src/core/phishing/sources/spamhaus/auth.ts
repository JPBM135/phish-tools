import { Buffer } from 'node:buffer';
import { setTimeout, setInterval, clearInterval } from 'node:timers';
import { request } from 'undici';
import { EnvironmentVariables, resolveEnv } from '../../../environment/resolveEnv.js';
import { SpamhausSource } from './spamhaus.js';

export interface ParsedSessionToken {
	expires: number;
	token: string;
}

export class SpamhausAuth {
	private readonly logger = SpamhausSource.logger.createChildren('SpamhausAuth');

	private readonly password: string;

	private readonly email: string;

	private _processing: boolean = false;

	private sessionToken: ParsedSessionToken | null;

	public constructor() {
		this.email = resolveEnv(EnvironmentVariables.SpamhausIntelEmail, true);
		this.password = resolveEnv(EnvironmentVariables.SpamhausIntelPassword, true);
		this.sessionToken = null;
	}

	public get hasSessionToken() {
		return Boolean(this.sessionToken && this.sessionToken.expires > Date.now());
	}

	public async createSessionToken(): Promise<ParsedSessionToken> {
		if (this.sessionToken) {
			this.logger.info('Session token already exist, returning it.');
			return this.sessionToken;
		}

		if (this._processing) {
			return new Promise((resolve) => {
				const interval = setInterval(() => {
					if (this.hasSessionToken) {
						clearInterval(interval);
						resolve(this.sessionToken!);
					}
				}, 10);
			});
		}

		this._processing = true;
		try {
			const response = await request(`${SpamhausSource.API_BASE_URL}/v1/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: this.email,
					password: this.password,
					realm: 'intel',
				}),
			});

			if (response.statusCode !== 200) {
				throw new Error(`Failed to create session token. Status: ${response.statusCode}`);
			}

			const token = (await response.body.json()) as { code: string; token: string };

			this.sessionToken = this._transformSessionToken(token.token);

			this._createExpireTimeout();

			this.logger.info('Created session token.', { expire: this.sessionToken.expires });

			return this.sessionToken;
		} finally {
			this._processing = false;
		}
	}

	private _createExpireTimeout() {
		setTimeout(
			() => {
				this.sessionToken = null;
			},
			(this.sessionToken?.expires ?? 0) - Date.now(),
		);
	}

	private _transformSessionToken(token: string): ParsedSessionToken {
		const [_, payload, __] = token.split('.') as [string, string, string];
		const decodedPayload = Buffer.from(payload, 'base64url').toString();
		const parsedPayload = JSON.parse(decodedPayload);

		return {
			expires: parsedPayload.exp * 1_000,
			token,
		};
	}

	public async fetchUrl<T>(path: string) {
		const token = await this.createSessionToken();

		const response = await request(SpamhausSource.API_BASE_URL + path, {
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token.token}`,
			},
		});

		if (response.statusCode !== 200) {
			this.logger.error(`Failed to fetch ${path}. Status: ${response.statusCode}`);
			return null;
		}

		return (await response.body.json()) as T;
	}
}
