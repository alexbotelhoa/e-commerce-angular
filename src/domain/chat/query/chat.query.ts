import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChat } from "../../../shared/repositories/chat.repository";

export const chatQueryResolver: GQLQueryResolvers['chat'] = async (obj, { userId }, context) => {
  const query = selectChat(context.database);

  if (userId) {
    query.where("userId", "like", userId);
  }

  return await query;
}
