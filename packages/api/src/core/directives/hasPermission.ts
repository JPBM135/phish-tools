import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import type { GraphQLSchema } from 'graphql';
import { PhishToolsError } from '../error/PhishToolsError.js';
import { PhishToolsErrorCodes } from '../error/codes.js';
import { roleToPermissions } from '../permissions/roleToPermissions.js';
import type { Permissions } from '../permissions/permissions.js';

export function HasPermissionDirective(schema: GraphQLSchema): GraphQLSchema {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const directive = getDirective(schema, fieldConfig, 'hasPermission');
			if (!directive || !directive.length) {
				return fieldConfig;
			}

			const { permission } = directive[0] as { permission: Permissions };

			const defaultFieldResolver = fieldConfig.resolve;
			// eslint-disable-next-line func-names
			fieldConfig.resolve = async function (...args) {
				const context = args[2];
				if (!context.authenticatedUser) {
					throw new PhishToolsError(
						'You must be authenticated to access this resource',
						PhishToolsErrorCodes.Unauthorized,
					);
				}

				const userPermissions = roleToPermissions(context.authenticatedUser.role);
				if (!userPermissions.includes(permission)) {
					throw new PhishToolsError(
						'You do not have permission to access this resource',
						PhishToolsErrorCodes.Forbidden,
					);
				}

				return defaultFieldResolver?.apply(this, args);
			};

			return fieldConfig;
		},
	});
}
