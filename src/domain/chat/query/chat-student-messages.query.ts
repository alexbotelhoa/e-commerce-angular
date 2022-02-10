import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChat } from "../../../shared/repositories/chat.repository";

export const chatStudentMessagesQueryResolver: GQLQueryResolvers['chat'] = async (obj, params, context) => {
  const query = selectChat(context.database);

  query.where("updatedAt", '>=', context.database.raw('DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)'));
  query.orderBy("updatedAt", "desc")

  return await query;
}
