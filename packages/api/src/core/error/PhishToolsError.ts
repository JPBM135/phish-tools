import { GraphQLError, type GraphQLErrorOptions } from 'graphql';

export class PhishToolsError extends GraphQLError implements Error {
	public constructor(message: string, code: string, options?: GraphQLErrorOptions) {
		super(message, {
			...options,
			extensions: {
				...options?.extensions,
				code,
			},
		});
	}
}
