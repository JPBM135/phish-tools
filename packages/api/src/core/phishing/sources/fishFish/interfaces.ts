import type { Buffer } from 'node:buffer';
import type WebSocket from 'ws';
import type { Category, WebSocketDataTypes } from './enums.js';

export interface CreateTokenResponseBody {
	expires: number;
	id: string;
	token: string;
}

export interface FishFishWebSocketData<T extends WebSocketDataTypes> extends RawWebSocketData<T> {
	data: RawWebSocketData<T>['data'] & {
		added: Date;
		checked: Date;
	};
}

export interface FishFishWebSocketOptions {
	callback?(data: FishFishWebSocketData<any>): void;
	debug?: boolean;
	fetchPeriodically?: boolean;
	identity?: string;
}

export interface FishFishWebSocketEvents {
	close: [data: { attemptReconnectAfterMilliseconds: number; code: number; reason: Buffer; tries: number }];
	data: [data: FishFishWebSocketData<any>];
	debug: [message: string, ...args: unknown[]];
	['domain_create']: [data: FishFishWebSocketData<WebSocketDataTypes.DomainCreate>['data']];
	['domain_delete']: [data: FishFishWebSocketData<WebSocketDataTypes.DomainDelete>['data']];
	['domain_update']: [data: FishFishWebSocketData<WebSocketDataTypes.DomainUpdate>['data']];
	error: [error: Error];
	open: [connection: WebSocket];
	raw: [raw: RawWebSocketData<any>];
	['url_create']: [data: FishFishWebSocketData<WebSocketDataTypes.UrlCreate>['data']];
	['url_delete']: [data: FishFishWebSocketData<WebSocketDataTypes.UrlDelete>['data']];
	['url_update']: [data: FishFishWebSocketData<WebSocketDataTypes.UrlUpdate>['data']];
}

export interface RawWebSocketData<T extends WebSocketDataTypes> {
	data: (T extends WebSocketDataTypes.DomainCreate | WebSocketDataTypes.DomainDelete | WebSocketDataTypes.DomainUpdate
		? {
				domain: string;
			}
		: {
				url: string;
			}) & {
		added: number;
		category: Category;
		checked: number;
		description: string;
	};
	type: T;
}

/**
 * The raw domain data returned from the API.
 *
 * @see https://api.fishfish.gg/v1/docs#type-domain
 */
export interface RawDomainData {
	/**
	 * The time the domain was added.
	 */
	added: number;
	/**
	 * The category of the domain.
	 */
	category: Category;
	/**
	 * The time the domain was last checked.
	 */
	checked: number;
	/**
	 * The description of the domain.
	 */
	description: string;
	/**
	 * The domain.
	 */
	domain: string;
	/**
	 * The target of the domain.
	 */
	target?: string;
}

/**
 * The raw URL data returned from the API.
 *
 * @see https://api.fishfish.gg/v1/docs#type-url
 */
export interface RawURLData {
	/**
	 * The time the URL was added.
	 */
	added: number;
	/**
	 * The category of the URL.
	 */
	category: Category;
	/**
	 * The time the URL was last checked.
	 */
	checked: number;
	/**
	 * The description of the URL.
	 */
	description: string;
	/**
	 * The target of the URL.
	 */
	target?: string;
	/**
	 * The URL.
	 */
	url: string;
}

/**
 * The formatted data for a Domain sent by the API.
 */
export interface FishFishDomain extends Omit<RawDomainData, 'added' | 'checked'> {
	/**
	 * The date this domain was added to the API.
	 */
	added: Date;

	/**
	 * The date this domain was last checked.
	 */
	checked: Date;
}

/**
 * The formatted data for a URL sent by the API.
 */
export interface FishFishURL extends Omit<RawURLData, 'added' | 'checked'> {
	/**
	 * The date this URL was added to the API.
	 */
	added: Date;
	/**
	 * The date this URL was last checked.
	 */
	checked: Date;
}
