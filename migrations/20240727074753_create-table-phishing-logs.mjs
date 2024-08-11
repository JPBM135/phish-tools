const TABLE = 'phishing_logs';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	await knex.schema.createTable(TABLE, (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('phishing_id').references('id').inTable('phishing').notNullable();
		table.string('message').notNullable();
		table.jsonb('metadata').defaultTo('{}').notNullable();
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
