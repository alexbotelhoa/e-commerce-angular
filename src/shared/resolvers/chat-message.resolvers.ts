import { ChatMessageEntity } from "../../entities/chat-message.entity"
import { GQLChatMessageResolvers } from "../../resolvers-types"

export const chatMessageEntityResolvers: Pick<GQLChatMessageResolvers, keyof ChatMessageEntity> = {
  id: obj => obj.id,
  userId: obj => obj.userId,
  isEtutor: obj => obj.isEtutor,
  levelCodeId: obj => obj.levelCodeId,
  levelCodeName: obj => obj.levelCodeName,
  levelThemeId: obj => obj.levelThemeId,
  levelThemeName: obj => obj.levelThemeName,
  cycleActivityId: obj => obj.cycleActivityId,
  cycleActivityName: obj => obj.cycleActivityName,
  message: obj => obj.message,
}
