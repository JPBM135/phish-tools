import { mergeResolvers } from '@graphql-tools/merge';
import { resolvers as AuthResolvers } from './auth/resolvers.js';
import { resolvers as CommonResolvers } from './common/resolvers.js';
import { resolvers as PhishResolvers } from './phish/resolvers.js';

export const resolvers = mergeResolvers([CommonResolvers, AuthResolvers, PhishResolvers]);
