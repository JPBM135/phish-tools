const TABLE = 'domains_cache';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	await knex.schema.raw(/* sql*/ `
		create type domains_cache_category as enum (
			'malicious',
			'unknown',
			'safe'
		);

		create type domains_cache_source as enum (
			'open_phish'
		);
	`);

	await knex.schema.createTable(TABLE, (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('url');
		table.string('domain').notNullable();
		table.specificType('category', 'domains_cache_category').notNullable();
		table.specificType('source', 'domains_cache_source').notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
	await knex.schema.dropTable(TABLE);
};
