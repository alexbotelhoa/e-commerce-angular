import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChat } from "../../../shared/repositories/chat.repository";

export const chatNewMessagesQueryResolver: GQLQueryResolvers['chatNewMessages'] = async (obj, { userId }, context) => {
  const query = selectChat(context.database);

  if (userId) {
    query.where("userId", "like", userId);
    query.andWhere("amountMessage", "=", 0);
    query.andWhere("isRead", "=", false);
    query.andWhere("updatedAt", '>=', context.database.raw('DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)'));
    query.orderBy("updatedAt", "desc");
  }

  return await query;
}
