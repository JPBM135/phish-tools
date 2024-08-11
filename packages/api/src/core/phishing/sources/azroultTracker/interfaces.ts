export interface AzroultTrackerResponse {
	_id: string;
	ip: string;
	as_org: string;
	asn: string;
	country_code: string;
	panel_index: string;
	panel_path: string;
	panel_version: string;
	status: string;
	feeder: string;
	first_seen: number;
	data: AzroultTrackerDomainData[];
	domain: string;
	tld: string;
}

export interface AzroultTrackerDomainData {
	date: number;
	config?: AzroultTrackerDomainDataConfig;
}

export interface AzroultTrackerDomainDataConfig {
	isDouble: boolean;
	isSavedPasswords: boolean;
	isBrowserData: boolean;
	isBrowserHistory: boolean;
	isWallets: boolean;
	isSkype: boolean;
	isTelegram: boolean;
	isSteam: boolean;
	isScreenshot: boolean;
	isDelete: boolean;
	files: AzroultTrackerDomainDataConfigFiles;
	loader: Loader;
}

export interface AzroultTrackerDomainDataConfigFiles {
	[fileIndex: string]: AzroultTrackerDomainDataConfigFilesData;
}

export interface AzroultTrackerDomainDataConfigFilesData {
	fgName: string;
	fgPath: string;
	fgMask: string;
	fgMaxsize: number;
	fgSubfolders: boolean;
	fgShortcuts: boolean;
	fgExceptions: string;
}

export interface Loader {}
