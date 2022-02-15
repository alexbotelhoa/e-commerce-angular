import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChatMessage } from "../../../shared/repositories/chat-message.repository";

export const chatMessageQueryResolver: GQLQueryResolvers['chatMessage'] = async (obj, { userId }, context) => {
  const query = selectChatMessage(context.readonlyDatabase);

  if (userId) {
    query.where("userId", "like", userId);
    query.andWhere("createdAt", '>=', context.database.raw('DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)'));
    query.orderBy("createdAt", "asc");
  }

  return await query;
}
