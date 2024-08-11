import type { Knex } from 'knex';
import type { PhishingLogsInput } from '../../@types/phishtools.schema.js';

export function insertPhishLog(db: Knex, input: PhishingLogsInput) {
	return db('phishing_logs').insert(input);
}
