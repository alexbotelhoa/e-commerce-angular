import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChatMessage } from "../../../shared/repositories/chat-message.repository";

export const chatMessageQueryResolver: GQLQueryResolvers['chatMessage'] = async (obj, { userId }, context) => {
  const query = selectChatMessage(context.readonlyDatabase);

  if (userId) {
    query.where("userId", "like", userId);
    query.orderBy("createdAt", "asc");
  }

  return await query;
}
