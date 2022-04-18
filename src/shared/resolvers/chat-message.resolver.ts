import { getUserById } from "../repositories/user.repository";
import { GQLChatMessageResolvers } from "../../resolvers-types";
import { ChatMessageEntity } from "../../entities/chat-message.entity";
import { getLevelCodeById } from "../repositories/level-code.repository";

const chatMessageEntityResolvers: Pick<GQLChatMessageResolvers, keyof ChatMessageEntity> = {
  id: obj => obj.id,
  userId: obj => obj.userId,
  isEtutor: obj => obj.isEtutor,
  levelCodeId: obj => obj.levelCodeId,
  levelCodeName: obj => obj.levelCodeName,
  levelThemeId: obj => obj.levelThemeId,
  levelThemeName: obj => obj.levelThemeName,
  cycleActivityId: obj => obj.cycleActivityId,
  cycleActivityName: obj => obj.cycleActivityName,
  activityName: obj => obj.activityName,
  message: obj => obj.message,
  createdAt: (obj) => obj.createdAt && new Date(obj.createdAt).toISOString(),
  updatedAt: (obj) => obj.updatedAt && new Date(obj.updatedAt).toISOString(),
}

export const levelCodeResolver: GQLChatMessageResolvers["levelCode"] = async (obj, params, context) => {
  const levelCodeId = obj.levelCodeId;
  return levelCodeId ? await getLevelCodeById(context.readonlyDatabase)(levelCodeId) as any : {};
}

export const chatMessageResolvers: GQLChatMessageResolvers = {
  ...chatMessageEntityResolvers,
  user: async (obj, params, context) => (await getUserById(context.readonlyDatabase)(obj.userId))!,
  levelCode: levelCodeResolver,
}