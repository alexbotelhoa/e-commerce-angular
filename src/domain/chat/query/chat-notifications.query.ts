import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChat } from "../../../shared/repositories/chat.repository";

export const chatNotificationsQueryResolver: GQLQueryResolvers['chat'] = async (obj, params, context) => {
  const query = selectChat(context.database);

  query.where("amountMessage", ">", 0);
  query.andWhere("isRead", "=", 0);

  return await query;
}
