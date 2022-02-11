import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChat } from "../../../shared/repositories/chat.repository";

export const chatStudentsQueryResolver: GQLQueryResolvers['chatStudents'] = async (obj, { data }, context) => {
  const query1 = selectChat(context.readonlyDatabase);
  query1.where("isRead", false)
  query1.orderBy("updatedAt", "asc")
  const resultQuery1 = await query1;
  
  const query2 = selectChat(context.readonlyDatabase);
  query2.where("updatedAt", '>=', context.readonlyDatabase.raw('DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)'));
  query2.where("isRead", true)
  query2.orderBy("updatedAt", "desc")
  const resultQuery2 = await query2;

  const mergeQueries = [...resultQuery1, ...resultQuery2];
  return mergeQueries;
}
