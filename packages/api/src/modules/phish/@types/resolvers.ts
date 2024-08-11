import type {
	TransformRecordToCamelCase,
	Phishing,
	PhishingScans,
	PhishingVeredicts,
	PhishingLogs,
} from '../../../@types/index.js';

export type GraphQLPhishing = TransformRecordToCamelCase<Phishing> & {
	scans: PhishingScans[];
	veredicts: PhishingVeredicts[];
	logs: PhishingLogs[];
};

export type GraphQLPhishingScans = TransformRecordToCamelCase<PhishingScans> & {
	data: Promise<Record<string, unknown> | null>;
};

export type GraphQLPhishingVeredicts =
	TransformRecordToCamelCase<PhishingVeredicts>;

export type GraphQLPhishingLogs = TransformRecordToCamelCase<PhishingLogs>;
