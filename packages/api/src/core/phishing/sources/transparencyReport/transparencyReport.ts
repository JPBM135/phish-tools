import logger from '../../../../logger.js';
import {
	PhishingCategory,
	type PhishingSource,
	type PhishingSourceCheckUrlResponse,
} from '../interfaces.js';
import { request } from 'undici';

export enum TransparencyReportSafetyStatus {
	NO_UNSAFE_CONTENT_FOUND = 1,
	SOME_PAGES_UNSAFE = 3,
	SITE_UNSAFE = 2,
	HOSTS_UNCOMMON_FILES = 5,
	CHECK_SPECIFIC_URL = 4,
	NO_AVAILABLE_DATA_0 = 0,
	NO_AVAILABLE_DATA_6 = 6,
}

export interface TransparencyReportData {
	safetyStatus: TransparencyReportSafetyStatus;
	maliciousSoftware: boolean;
	trickVisitors: boolean;
	unwantedSoftware: boolean;
	uncommonDownloads: boolean;
	lastModified: number;
	url: string;
}

export class TransparencyReportSource
	implements PhishingSource<TransparencyReportData>
{
	public static readonly SOURCE_NAME = 'transparency_report';

	public static API_BASE_URL =
		'https://transparencyreport.google.com/transparencyreport/api/v3/safebrowsing/status';

	public static logger = logger.createChildren('TransparencyReport');

	private static instance: TransparencyReportSource;

	public static getInstance() {
		return (this.instance ??= new TransparencyReportSource());
	}

	async checkUrl(
		url: string,
	): Promise<PhishingSourceCheckUrlResponse<TransparencyReportData>> {
		const response = await request(
			TransparencyReportSource.API_BASE_URL + `?site=${url}`,
			{
				method: 'GET',
			},
		);

		if (response.statusCode !== 200) {
			return {
				verdict: PhishingCategory.Unknown,
				data: null,
			};
		}

		const rawResponse = await response.body.text();

		const data = this.parseTransparencyReportData(rawResponse);

		return {
			verdict: this.convertSafetyStatusToPhishingCategory(data.safetyStatus),
			data,
		};
	}

	private parseTransparencyReportData(
		rawResponse: string,
	): TransparencyReportData {
		const jsonLine = rawResponse.split('\n').slice(-1)[0]!;
		const data = JSON.parse(jsonLine)[0] as [
			'sb.ssr',
			TransparencyReportSafetyStatus,
			boolean,
			boolean,
			boolean,
			boolean,
			boolean,
			number,
			string,
		];

		return {
			safetyStatus: data[1],
			maliciousSoftware: data[2],
			trickVisitors: data[3],
			unwantedSoftware: data[4],
			uncommonDownloads: data[5],
			lastModified: data[7],
			url: data[8],
		};
	}

	private convertSafetyStatusToPhishingCategory(
		safetyStatus: TransparencyReportSafetyStatus,
	): PhishingCategory {
		switch (safetyStatus) {
			case TransparencyReportSafetyStatus.NO_UNSAFE_CONTENT_FOUND:
				return PhishingCategory.Safe;
			case TransparencyReportSafetyStatus.SOME_PAGES_UNSAFE:
			case TransparencyReportSafetyStatus.SITE_UNSAFE:
			case TransparencyReportSafetyStatus.HOSTS_UNCOMMON_FILES:
				return PhishingCategory.Malicious;
			case TransparencyReportSafetyStatus.CHECK_SPECIFIC_URL:
			case TransparencyReportSafetyStatus.NO_AVAILABLE_DATA_0:
			case TransparencyReportSafetyStatus.NO_AVAILABLE_DATA_6:
				return PhishingCategory.Unknown;
			default:
				return PhishingCategory.Unknown;
		}
	}
}
