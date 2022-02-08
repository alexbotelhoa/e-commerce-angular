/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ChatEntity } from "../../entities/chat.entity"
import { GQLChatResolvers } from "../../resolvers-types"

const chatEntityResolvers: Pick<GQLChatResolvers, keyof ChatEntity> = {
  userId: obj => obj.userId.toString(),
}

export const chatMessages = async () => []

export const chatResolvers: GQLChatResolvers = {
  ...chatEntityResolvers,
  messages: chatMessages
}
