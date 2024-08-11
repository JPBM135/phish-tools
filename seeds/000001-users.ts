import type { Knex } from 'knex';

export const seed = async (knex: Knex): Promise<void> => {
	await knex('users').insert([
		{
			name: 'JPBM135',
			email: 'contact@jpbm.dev',
			password: '$2a$12$D0vzOLE65mQJX0aZK03Y3.wiBl2KYQL7NLh1S7IE/.PuMEnBqvwOG', // teste
		},
	]);
};
