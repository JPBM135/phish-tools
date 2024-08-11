import { mergeTypeDefs } from '@graphql-tools/merge';
import { schema as authTypeDefs } from './auth/schema.js';
import { schema as globalTypeDefs } from './common/schema.js';
import { schema as phishTypeDefs } from './phish/schema.js';

export const typeDefs = mergeTypeDefs([globalTypeDefs, authTypeDefs, phishTypeDefs]);
