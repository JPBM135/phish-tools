import { gql } from 'graphql-tag';

export const schema = gql`
	type Query {
		CheckPhishUrl(url: String!): PhishCheckResult
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
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	enum PhishScanStatus {
		pending
		success
		failed
	}

	enum PhishScanSource {
		url_scan
		cloudflare
		phish_observer
		checkphish_ai
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
		suspicious
		safe
		unknown
		rate_limited
	}

	enum PhishVeredictSource {
		openphish
		phishtank
		fishfish
		url_haus
		google_safe_browsing
		google_transparency_report
		spamhaus
	}

	type PhishLog {
		id: ID!
		message: String!
		metadata: JSON!
		createdAt: DateTime!
	}
`;
