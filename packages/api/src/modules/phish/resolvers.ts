import type {
	Phishing,
	PhishingLogs,
	PhishingScans,
	PhishingVeredicts,
} from '../../@types/phishtools.schema.js';
import { SCANNERS } from '../../core/phishing/index.js';
import { dateResolver } from '../../core/utils/dateResolver.js';
import type {
	PhishToolsResolverMap,
	PhishToolsUnitResolver,
} from '../interfaces.js';
import type {
	GraphQLPhishing,
	GraphQLPhishingLogs,
	GraphQLPhishingScans,
	GraphQLPhishingVeredicts,
} from './@types/resolvers.js';
import { CheckPhishUrl } from './queries/CheckPhishUrl.js';
import { GetPhish } from './queries/GetPhish.js';

interface PhishUnitResolvers {
	PhishCheckResult: PhishToolsUnitResolver<Phishing, GraphQLPhishing>;
	PhishScan: PhishToolsUnitResolver<PhishingScans, GraphQLPhishingScans>;
	PhishVeredict: PhishToolsUnitResolver<
		PhishingVeredicts,
		GraphQLPhishingVeredicts
	>;
	PhishLog: PhishToolsUnitResolver<PhishingLogs, GraphQLPhishingLogs>;
}

type PhishResolvers = PhishToolsResolverMap<
	{
		CheckPhishUrl: typeof CheckPhishUrl;
		GetPhish: typeof GetPhish;
	},
	null,
	PhishUnitResolvers
>;

export const resolvers: PhishResolvers = {
	Query: {
		CheckPhishUrl,
		GetPhish,
	},
	PhishCheckResult: {
		createdAt: (parent) => dateResolver(parent.created_at),
		updatedAt: (parent) => dateResolver(parent.updated_at),
		logs: async (parent, _, { db }) => {
			return db('phishing_logs').where('phishing_id', parent.id);
		},
		scans: async (parent, _, { db }) => {
			return db('phishing_scans').where('phishing_id', parent.id);
		},
		veredicts: async (parent, _, { db }) => {
			return db('phishing_veredicts').where('phishing_id', parent.id);
		},
	},
	PhishScan: {
		createdAt: (parent) => dateResolver(parent.created_at),
		updatedAt: (parent) => dateResolver(parent.updated_at),
		scanId: (parent) => parent.scan_id,
		data: async (parent) => {
			if (parent.status !== 'success') {
				return null;
			}

			const source = SCANNERS[parent.source];

			if (!source) {
				return null;
			}

			const sourceInstance = source.getInstance();

			const result = (await sourceInstance
				.fetchJob(parent.scan_id)
				.catch(() => null)) as Record<string, unknown> | null;

			return result;
		},
	},
	PhishVeredict: {
		createdAt: (parent) => dateResolver(parent.created_at),
		updatedAt: (parent) => dateResolver(parent.updated_at),
		veredictId: (parent) => parent.veredict_id,
	},
	PhishLog: {
		createdAt: (parent) => dateResolver(parent.created_at),
	},
};
