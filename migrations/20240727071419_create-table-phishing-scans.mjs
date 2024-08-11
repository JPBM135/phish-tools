const TABLE = 'phishing_scans';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	await knex.raw(/* sql */ `
		create type phishing_scan_status as enum ('pending', 'success', 'failed');
		create type phishing_scan_source as enum ('url_scan', 'cloudflare', 'phish_observer', 'checkphish_ai');
	`);

	await knex.schema.createTable(TABLE, (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('phishing_id').references('id').inTable('phishing').notNullable();
		table.specificType('status', 'phishing_scan_status').defaultTo('pending').notNullable();
		table.specificType('source', 'phishing_scan_source').notNullable();
		table.string('scan_id').notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
		table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
	});

	await knex.raw(/* sql */ `
		create trigger set_current_timestamp_updated_at
		before update on phishing_scans
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
