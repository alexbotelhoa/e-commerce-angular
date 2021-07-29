import { DateTimeResolver } from 'graphql-scalars';
import { GQLResolvers } from '../../resolvers-types';

export const dateTimeScalarResolver: GQLResolvers['DateTime'] = DateTimeResolver;
