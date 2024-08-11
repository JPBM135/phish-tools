import { URLSearchParams } from 'node:url';
import { Collection } from 'discord.js';
import { request } from 'undici';
import logger from '../../../../logger.js';
import { FishFishAuth } from './auth.js';
import { Category } from './enums.js';
import type { FishFishDomain } from './interfaces.js';
import { FishFishWebSocket } from './websocket.js';

export class FishFishSource {
	public static API_BASE_URL = 'https://api.fishfish.gg/v1';

	public static WEBSOCKET_BASE_URL = 'wss://api.fishfish.gg/v1/stream/';

	public static IDENTITY = 'JPBM135/Phish-Toolbox';

	public static logger = logger.createChildren('FishFishSource');

	private static instance: FishFishSource;

	public static getInstance() {
		return (this.instance ??= new FishFishSource());
	}

	public cache = new Collection<string, FishFishDomain>();

	private readonly auth: FishFishAuth;

	private readonly webSocket: FishFishWebSocket;

	private constructor() {
		this.auth = new FishFishAuth();
		this.webSocket = new FishFishWebSocket({ auth: this.auth, manager: this });
		this.webSocket.on('open', () => {
			logger.info('Connected to FishFish WebSocket.');
		});
	}

	public async checkBulk(domains: string[], bypassCache = false) {
		const results: FishFishDomain[] = [];

		if (bypassCache) {
			await this.getAllDomains();
		}

		for (const domain of domains) {
			const result = this.cache.get(domain);

			if (result) {
				results.push(result);
			}
		}

		return results;
	}

	public async checkDomain(domain: string, bypassCache = false): Promise<FishFishDomain | null> {
		if (!bypassCache && this.cache.has(domain)) {
			return this.cache.get(domain)!;
		}

		return this.getDomain(domain);
	}

	public async getDomain(domain: string): Promise<FishFishDomain | null> {
		if (this.cache.has(domain)) {
			return this.cache.get(domain)!;
		}

		const response = await request(`${FishFishSource.API_BASE_URL}/domains/${domain}`, {
			method: 'GET',
			headers: {
				Authorization: this.auth.sessionToken!.token,
			},
		});

		if (response.statusCode !== 200) {
			return null;
		}

		const data = (await response.body.json()) as FishFishDomain;

		this.cache.set(domain, data);

		return data;
	}

	public async getAllDomains(): Promise<FishFishDomain[]> {
		const _options = {
			full: true,
			category: Category.Phishing,
		};

		if (_options.full) {
			await this._assertToken();
		}

		const params = new URLSearchParams();
		params.append('category', _options.category ?? Category.Phishing);
		params.append('full', _options.full!.toString());

		const response = await request(`${FishFishSource.API_BASE_URL}/domains?${params.toString()}`, {
			method: 'GET',
			headers: {
				Authorization: this.auth.sessionToken!.token,
			},
		});

		if (response.statusCode !== 200) {
			return [];
		}

		const data = (await response.body.json()) as FishFishDomain[];

		for (const domain of data) {
			this.cache.set(domain.domain, domain);
		}

		return data;
	}

	private async _assertToken() {
		await this.auth.createSessionToken();
	}
}
