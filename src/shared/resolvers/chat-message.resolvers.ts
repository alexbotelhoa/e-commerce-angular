import { ChatMessageEntity } from "../../entities/chat-message.entity"
import { GQLChatMessageResolvers } from "../../resolvers-types"

export const chatMessageEntityResolvers: Pick<GQLChatMessageResolvers, keyof ChatMessageEntity> = {
  userId: obj => obj.userId.toString()
}