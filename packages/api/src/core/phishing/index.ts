import { CheckPhishAiScanner } from './scanners/CheckPhishAiScanner.js';
import { CloudflareRadarScanner } from './scanners/CloudflareRadarScanner.js';
import { PhishObserverScanner } from './scanners/PhishObserverScanner.js';
import { UrlScanScanner } from './scanners/UrlScanScanner.js';
import { AbuseChSource } from './sources/abuseCh/abuseCh.js';
import { AzroultTrackerSource } from './sources/azroultTracker/azroultTracker.js';
import { FishFishSource } from './sources/fishFish/fishFish.js';
import { OpenPhishSource } from './sources/openPhish/openPhish.js';
import { TransparencyReportSource } from './sources/transparencyReport/transparencyReport.js';

export const SCANNERS = {
	[UrlScanScanner.SCANNER_NAME]: UrlScanScanner,
	[CheckPhishAiScanner.SCANNER_NAME]: CheckPhishAiScanner,
	[CloudflareRadarScanner.SCANNER_NAME]: CloudflareRadarScanner,
	[PhishObserverScanner.SCANNER_NAME]: PhishObserverScanner,
};

export const SOURCES = {
	[AbuseChSource.SOURCE_NAME]: AbuseChSource,
	[AzroultTrackerSource.SOURCE_NAME]: AzroultTrackerSource,
	[FishFishSource.SOURCE_NAME]: FishFishSource,
	[OpenPhishSource.SOURCE_NAME]: OpenPhishSource,
	[TransparencyReportSource.SOURCE_NAME]: TransparencyReportSource,
};
