const TABLE = 'users_tokens';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	await knex.schema.createTable(TABLE, (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('user_id').references('id').inTable('users').notNullable();
		table.string('token_id').notNullable();
		table.specificType('permissions', 'text[]').notNullable();
		table.timestamp('expires_at');
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
