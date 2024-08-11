import { gql } from 'graphql-tag';

export const schema = gql`
	directive @requireAuth on FIELD_DEFINITION
	directive @hasPermission(permission: String!) on FIELD_DEFINITION

	scalar DateTime
	scalar JSON

	type PageInfo {
		count: Int!
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
	}

	type User {
		id: ID!
		email: String!
		name: String!
	}

	type UserWithToken {
		user: User!
		token: String!
	}
`;
