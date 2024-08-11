import type { PhishToolsResolverMap } from '../interfaces.js';
import { Auth } from './mutations/Auth.js';
import { GetNonce } from './queries/GetNonce.js';

type AuthResolvers = PhishToolsResolverMap<
	{
		GetNonce: typeof GetNonce;
	},
	{
		Auth: typeof Auth;
	}
>;

export const resolvers: AuthResolvers = {
	Query: {
		GetNonce,
	},
	Mutation: {
		Auth,
	},
};
