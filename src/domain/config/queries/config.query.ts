import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectConfig } from "../../../shared/repositories/config.repository";

export const configQueryResolver: GQLQueryResolvers['config'] = async (obj, params, context) => {
  const user = context.currentUser;

  if (!user) {
    throw new Error('User not authorized');
  }

  return await selectConfig(context.database);
}
