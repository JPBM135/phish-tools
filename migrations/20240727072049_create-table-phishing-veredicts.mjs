const TABLE = 'phishing_veredicts';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	await knex.raw(/* sql */ `
		create type phishing_veredicts_status as enum ('malicious', 'suspicious', 'safe', 'unknown', 'rate_limited');
    create type phishing_veredicts_source as enum ('openphish', 'phishtank', 'fishfish', 'url_haus', 'google_safebrowsing', 'google_transparencyreport', 'spamhaus');
	`);

	await knex.schema.createTable(TABLE, (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('phishing_id').references('id').inTable('phishing').notNullable();
		table.specificType('status', 'phishing_veredicts_status').defaultTo('unknown').notNullable();
		table.specificType('source', 'phishing_veredicts_source').notNullable();
		table.string('veredict_id');
		table.jsonb('metadata').defaultTo('{}').notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
		table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
	});

	await knex.raw(/* sql */ `
    create trigger set_current_timestamp_updated_at
    before update on phishing_veredicts
    for each row
    execute function set_current_timestamp_updated_at();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
	await knex.schema.dropTable(TABLE);

	await knex.raw(`
		drop type phishing_scan_status;
		drop type phishing_scan_source;
	`);
};
