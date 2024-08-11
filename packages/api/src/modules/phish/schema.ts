import { gql } from 'graphql-tag';

export const schema = gql`
	type Query {
		CheckPhishUrl(url: String!): PhishCheckResult
		GetPhish(id: ID!): PhishCheckResult
	}

	type PhishCheckResult {
		id: ID!
		domain: String!
		url: String!
		hidden: Boolean!
		scans: [PhishScan!]!
		veredicts: [PhishVeredict!]!
		logs: [PhishLog!]!
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	type PhishScan {
		id: ID!
		status: PhishScanStatus!
		source: PhishScanSource!
		scanId: String!
		data: JSON
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	enum PhishScanStatus {
		pending
		success
		failed
	}

	enum PhishScanSource {
		urlscan
		check_phish_ai
		cloudflare_radar
		phish_observer
	}

	type PhishVeredict {
		id: ID!
		status: PhishVeredictStatus!
		source: PhishVeredictSource!
		veredictId: String
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	enum PhishVeredictStatus {
		malicious
		safe
		unknown
		rate_limited
	}

	enum PhishVeredictSource {
		abuse_ch
		azroult_tracker
		fish_fish
		open_phish
		transparency_report
	}

	type PhishLog {
		id: ID!
		message: String!
		metadata: JSON!
		createdAt: DateTime!
	}
`;
