const TABLE = 'phishing';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	await knex.schema.createTable(TABLE, (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.string('domain').notNullable().index();
		table.string('url').notNullable().index();
		table.boolean('hidden').defaultTo(false).notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
		table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
	});

	await knex.raw(/* sql */ `
		create trigger set_current_timestamp_updated_at
		before update on phishing
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
};
