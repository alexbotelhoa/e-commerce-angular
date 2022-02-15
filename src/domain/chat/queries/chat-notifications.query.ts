import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChat } from "../../../shared/repositories/chat.repository";

export const chatNotificationsQueryResolver: GQLQueryResolvers['chatNotifications'] = async (obj, params, context) => {
  const query = selectChat(context.database);

  query.where("amountMessage", ">", 0);

  return await query;
}
