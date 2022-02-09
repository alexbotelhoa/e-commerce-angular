import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChatMessage } from "../../../shared/repositories/chat-message.repository";

export const chatMessageQueryResolver: GQLQueryResolvers['chatMessage'] = async (obj, { userId }, context) => {
  const query = selectChatMessage(context.database);

  if (userId) {
    query.where("userId", "like", userId);
  }

  return await query;
}
