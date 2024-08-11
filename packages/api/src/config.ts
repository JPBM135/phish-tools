import process from 'node:process';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const { ENVIRONMENT } = process.env as {
	ENVIRONMENT?: 'dev' | 'prod';
};

const nodeEnv = ENVIRONMENT === 'prod' ? 'prod' : 'dev';

const envConfig = {
	DB_HOST: process.env.DB_HOST!,
	DB_NAME: process.env.DB_NAME!,
	DB_PASSWORD: process.env.DB_PASSWORD!,
	DB_PORT: process.env.DB_PORT!,
	DB_SSL: process.env.DB_SSL!,
	DB_USER: process.env.DB_USER!,
	FEED_WEBHOOK_URL: process.env.FEED_WEBHOOK_URL!,
	PORT: process.env.PORT!,
	SECRET_LOGIN_HMAC: process.env.SECRET_LOGIN_HMAC!,
	SECRET_API_HMAC: process.env.SECRET_API_HMAC!,
	SECRET_STATE_HMAC: process.env.SECRET_STATE_HMAC!,
	SENTRY_DSN: process.env.SENTRY_DSN!,
	DATABASE_URL: process.env.DATABASE_URL!,
	FISH_FISH_TOKEN: process.env.FISH_FISH_TOKEN!,
	PHISH_OBSERVER_TOKEN: process.env.PHISH_OBSERVER_TOKEN!,
	URLSCAN_TOKEN: process.env.URLSCAN_TOKEN!,
	SPAMHAUS_INTEL_EMAIL: process.env.SPAMHAUS_INTEL_EMAIL!,
	SPAMHAUS_INTEL_PASSWORD: process.env.SPAMHAUS_INTEL_PASSWORD!,
	CHECKPHISH_AI_TOKEN: process.env.CHECKPHISH_AI_TOKEN!,
	CLOUDFLARE_URLSCAN_TOKEN: process.env.CLOUDFLARE_URLSCAN_TOKEN!,
	CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID!,
	OPENPHISH_FEED_TOKEN: process.env.OPENPHISH_FEED_TOKEN!,
};

if (nodeEnv === 'prod') {
	const someIsMissing = Object.entries(envConfig).some(([, value]) => value === undefined || value === null);
	if (someIsMissing) {
		throw new Error('Missing environment variables');
	}
}

export const config = {
	port: envConfig.PORT,
	environment: nodeEnv,
	sentryDSN: envConfig.SENTRY_DSN,
	isProduction: ENVIRONMENT === 'prod',
	feedWebhookUrl: envConfig.FEED_WEBHOOK_URL,
	secret: {
		apiHmac: envConfig.SECRET_API_HMAC,
		loginHmac: envConfig.SECRET_LOGIN_HMAC,
		stateHmac: envConfig.SECRET_STATE_HMAC,
	},
	tokens: {
		fishFish: envConfig.FISH_FISH_TOKEN,
		phishObserver: envConfig.PHISH_OBSERVER_TOKEN,
		urlScan: envConfig.URLSCAN_TOKEN,
		spamhausIntel: {
			email: envConfig.SPAMHAUS_INTEL_EMAIL,
			password: envConfig.SPAMHAUS_INTEL_PASSWORD,
		},
		checkPhishAI: envConfig.CHECKPHISH_AI_TOKEN,
		cloudFlare: {
			token: envConfig.CLOUDFLARE_URLSCAN_TOKEN,
			accountId: envConfig.CLOUDFLARE_ACCOUNT_ID,
		},
		openPhishFeed: envConfig.OPENPHISH_FEED_TOKEN,
	},
	db: {
		name: envConfig.DB_NAME,
		password: envConfig.DB_PASSWORD,
		port: envConfig.DB_PORT,
		host: envConfig.DB_HOST,
		user: envConfig.DB_USER,
		ssl: envConfig.DB_SSL,
	},
};
