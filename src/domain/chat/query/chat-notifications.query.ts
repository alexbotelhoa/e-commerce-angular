import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChat } from "../../../shared/repositories/chat.repository";

export const chatNotificationsQueryResolver: GQLQueryResolvers['chat'] = async (obj, { userId }, context) => {
  const query = selectChat(context.database);

  if (userId) {
    query.where("userId", "like", userId);
    query.andWhere("amountMessage", ">", 0);
    query.andWhere("isRead", "=", 0);
  }

  return await query;
}
