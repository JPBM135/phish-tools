import type { Buffer } from 'node:buffer';
import EventEmitter from 'node:events';
import { setTimeout, setInterval } from 'node:timers';
import WebSocket from 'ws';
import type { If } from '../../../../@types/utils.js';
import type { FishFishAuth } from './auth.js';
import { WebSocketDataTypes } from './enums.js';
import { FishFishSource } from './fishFish.js';
import type { FishFishDomain, FishFishWebSocketData, FishFishWebSocketEvents, RawWebSocketData } from './interfaces.js';
import { transformData } from './utils.js';

export class FishFishWebSocket {
	private readonly logger = FishFishSource.logger.createChildren('FishFishWebSocket');

	private readonly emitter = new EventEmitter();

	private connection: WebSocket | null;

	private readonly manager: FishFishSource | null;

	private readonly auth: FishFishAuth;

	private readonly fetchPeriodically: boolean;

	private readonly identity: string;

	private readonly WebSocketUrl = FishFishSource.WEBSOCKET_BASE_URL;

	private fetchTimeout: NodeJS.Timeout | null = null;

	private tries = 0;

	private timeSinceLastConnection = 0;

	public constructor({ auth, manager }: { auth: FishFishAuth; manager: FishFishSource }) {
		this.fetchPeriodically = true;

		this.manager = manager;

		this.auth = auth;

		this.connection = null;

		this.identity = FishFishSource.IDENTITY;

		void this.connect();

		if (this.manager) {
			this.on('data', this.onData.bind(this));
		}

		if (this.fetchPeriodically) {
			void this.fetch();
		}
	}

	public get webSocket() {
		return this.connection;
	}

	public async connect() {
		this.logger.debug('Attempting to connect to WebSocket...');

		this.connection = new WebSocket(this.WebSocketUrl, {
			auth: (await this.auth.createSessionToken()).token,
			headers: {
				Authorization: (await this.auth.createSessionToken()).token,
				'X-Identity': this.identity,
			},
		});

		this.connection.on('open', this.onOpen.bind(this));
		this.connection.on('message', this.onMessage.bind(this));
		this.connection.on('close', this.onClose.bind(this));
		this.connection.on('error', this.onError.bind(this));

		if (this.fetchPeriodically && !this.fetchTimeout) {
			this.logger.debug('Creating fetch interval...');
			this.fetchTimeout = setInterval(this.fetch.bind(this), 60 * 60 * 1_000);
		}
	}

	private onOpen() {
		this.logger.debug(`WebSocket connected to ${this.WebSocketUrl}`, {
			tries: this.tries,
			timeSinceLastConnection: this.timeSinceLastConnection,
		});
		this.tries = 0;
		this.timeSinceLastConnection = Date.now();

		this.emit('open', this.connection!);
	}

	private onError(error: Error) {
		this.logger.debug(`Unknown error received (${this.WebSocketUrl});`, error);

		this.emit('error', error);
	}

	private onMessage(rawData: Buffer) {
		const objData = JSON.parse(rawData.toString()) as RawWebSocketData<any>;

		this.emit('raw', objData);

		const { type } = objData;
		const data = transformData<RawWebSocketData<any>['data']>(objData.data);

		this.emit('data', {
			type,
			data: data as FishFishWebSocketData<any>['data'],
		});

		this.emit(objData.type, data);
	}

	private onClose(code: number, reason: Buffer) {
		const backOff = this.backOff();
		this.tries += 1;

		this.logger.debug(
			`WebSocket closed with code ${code} and reason ${reason}. Attempting reconnect after ${String(
				Math.round(backOff / 1_000),
			)} seconds`,
			{
				code,
				reason,
				attemptReconnectAfterMilliseconds: backOff,
				tries: this.tries,
				timeSinceLastConnection: this.timeSinceLastConnection ? Date.now() - this.timeSinceLastConnection : 0,
			},
		);

		this.emit('close', {
			code,
			tries: this.tries,
			reason,
			attemptReconnectAfterMilliseconds: backOff,
		});

		setTimeout(() => {
			void this.connect();
		}, this.backOff());
	}

	private backOff() {
		return Math.min(Math.floor(Math.exp(this.tries)), 10 * 60) * 1_000;
	}

	private onData(rawData: RawWebSocketData<any>) {
		this.logger.debug('Received data from WebSocket', rawData);

		if (!this.manager) return;

		const data = transformData<RawWebSocketData<any>['data']>(rawData.data) as FishFishWebSocketData<any>['data'];

		if (this.manager) {
			switch (rawData.type) {
				case WebSocketDataTypes.DomainCreate:
					this.manager.cache.set((data as FishFishDomain).domain!, data as FishFishDomain);

					break;
				case WebSocketDataTypes.DomainDelete:
					this.manager.cache.delete((data as FishFishDomain).domain!);

					break;
				case WebSocketDataTypes.DomainUpdate:
					// eslint-disable-next-line no-case-declarations
					const domain = this.manager.cache.get((data as FishFishDomain).domain!) ?? {};

					this.manager.cache.set((data as FishFishDomain).domain!, { ...domain, ...(data as FishFishDomain) });

					break;
				case WebSocketDataTypes.UrlCreate:
				case WebSocketDataTypes.UrlDelete:
				case WebSocketDataTypes.UrlUpdate:
					this.logger.debug('Received URL data from WebSocket', data);
					break;
				default:
					this.logger.debug(`Unknown data type received ${rawData.type}`);
			}
		}
	}

	private async fetch() {
		this.logger.debug('Fetching data from Fish.Fish API');

		if (this.manager) {
			await this.manager.getAllDomains();
		}
	}

	/**
	 * Checks if the data is a url data type and narrows the type
	 *
	 * @param data - The websocket data to check
	 * @returns True if the data is a url data type
	 */
	public static isUrlData<T extends FishFishWebSocketData<any> | RawWebSocketData<any> = FishFishWebSocketData<any>>(
		data: FishFishWebSocketData<any> | RawWebSocketData<any>,
	): data is If<
		T,
		FishFishWebSocketData<any>,
		FishFishWebSocketData<WebSocketDataTypes.UrlCreate | WebSocketDataTypes.UrlDelete | WebSocketDataTypes.UrlUpdate>,
		RawWebSocketData<WebSocketDataTypes.UrlCreate | WebSocketDataTypes.UrlDelete | WebSocketDataTypes.UrlUpdate>
	> {
		return [WebSocketDataTypes.UrlCreate, WebSocketDataTypes.UrlUpdate, WebSocketDataTypes.UrlDelete].includes(
			data.type!,
		);
	}

	/**
	 * Checks if the data is a domain data type and narrows the type
	 *
	 * @param data - The websocket data to check
	 * @returns True if the data is a domain data type
	 */
	public static isDomainData<T extends FishFishWebSocketData<any> | RawWebSocketData<any> = FishFishWebSocketData<any>>(
		data: FishFishWebSocketData<any> | RawWebSocketData<any>,
	): data is If<
		T,
		FishFishWebSocketData<any>,
		FishFishWebSocketData<
			WebSocketDataTypes.DomainCreate | WebSocketDataTypes.DomainDelete | WebSocketDataTypes.DomainUpdate
		>,
		RawWebSocketData<
			WebSocketDataTypes.DomainCreate | WebSocketDataTypes.DomainDelete | WebSocketDataTypes.DomainUpdate
		>
	> {
		return [WebSocketDataTypes.DomainCreate, WebSocketDataTypes.DomainUpdate, WebSocketDataTypes.DomainDelete].includes(
			data.type!,
		);
	}

	public emit<TEventName extends string & keyof FishFishWebSocketEvents>(
		eventName: TEventName,
		...eventArg: FishFishWebSocketEvents[TEventName]
	) {
		this.emitter.emit(eventName, ...eventArg);
	}

	public on<TEventName extends string & keyof FishFishWebSocketEvents>(
		eventName: TEventName,
		handler: (...eventArg: FishFishWebSocketEvents[TEventName]) => void,
	) {
		this.emitter.on(eventName, handler as any);
	}

	public once<TEventName extends string & keyof FishFishWebSocketEvents>(
		eventName: TEventName,
		handler: (...eventArg: FishFishWebSocketEvents[TEventName]) => void,
	) {
		this.emitter.once(eventName, handler as any);
	}

	public off<TEventName extends string & keyof FishFishWebSocketEvents>(
		eventName: TEventName,
		handler: (...eventArg: FishFishWebSocketEvents[TEventName]) => void,
	) {
		this.emitter.off(eventName, handler as any);
	}
}
