import { GQLQueryResolvers } from "../../../resolvers-types";
import { selectChat } from "../../../shared/repositories/chat.repository";

export const chatHeaderQueryResolver: GQLQueryResolvers['chatHeader'] = async (obj, { userId }, context) => {
  return await selectChat(context.readonlyDatabase).where("userId", "=", userId);
}
