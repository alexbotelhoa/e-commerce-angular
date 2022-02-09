/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ChatEntity } from "../../entities/chat.entity";
import { GQLChatResolvers } from "../../resolvers-types";

const chatEntityResolvers: Pick<GQLChatResolvers, keyof ChatEntity> = {
  id: obj => obj.id,
  userId: obj => obj.userId,
  firstMessage: obj => obj.firstMessage,
  dateMessage: obj => obj.dateMessage,
  amountMessage: obj => obj.amountMessage,
  isRead: obj => obj.isRead,
}

export const chatResolvers: GQLChatResolvers = {
  ...chatEntityResolvers,
}
