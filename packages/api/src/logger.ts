import { inspect } from 'node:util';
import kleur from 'kleur';

kleur.enabled = true;

inspect.defaultOptions.depth = 10;
inspect.defaultOptions.maxArrayLength = 100;

interface ILogger {
	debug(message: string, ...args: any[]): void;
	error(message: string, ...args: any[]): void;
	info(message: string, ...args: any[]): void;
	success(message: string, ...args: any[]): void;
	warn(message: string, ...args: any[]): void;
}

export enum LoggerLevel {
	Error,
	Info,
	Debug,
}

class Logger implements ILogger {
	public static LOGGER_LEVEL = LoggerLevel.Debug;

	public static setLevel(level: LoggerLevel) {
		Logger.LOGGER_LEVEL = level;
	}

	public PREFIX = '';

	public constructor(prefix?: string) {
		if (prefix) this.PREFIX = prefix;
	}

	public success(message: string, ...args: any[]) {
		console.log(`${kleur.green(`[Success]:` + (this.PREFIX ? ` [${this.PREFIX}]` : ''))} ${message}`, ...args);
	}

	public info(message: string, ...args: any[]) {
		if (Logger.LOGGER_LEVEL < LoggerLevel.Info) return;
		console.log(`${kleur.blue('[Info]:' + (this.PREFIX ? ` [${this.PREFIX}]` : ''))} ${message}`, ...args);
	}

	public debug(message: string, ...args: any[]) {
		if (Logger.LOGGER_LEVEL < LoggerLevel.Debug) return;
		console.log(`${kleur.gray('[Debug]:' + (this.PREFIX ? ` [${this.PREFIX}]` : ''))} ${message}`, ...args);
	}

	public warn(message: string, ...args: any[]) {
		console.log(`${kleur.yellow('[Warn]:' + (this.PREFIX ? ` [${this.PREFIX}]` : ''))} ${message}`, ...args);
	}

	public error(message: string, ...args: any[]) {
		console.trace(`${kleur.red('[Error]:' + (this.PREFIX ? ` [${this.PREFIX}]` : ''))} ${message}`, ...args);
	}

	public createChildren(prefix: string) {
		if (!this.PREFIX) return new Logger(prefix);
		return new Logger(`${this.PREFIX}/${prefix}`);
	}
}

export default new Logger();
