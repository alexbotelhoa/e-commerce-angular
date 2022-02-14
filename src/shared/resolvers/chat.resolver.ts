import { ChatEntity } from "../../entities/chat.entity";
import { GQLChatResolvers } from "../../resolvers-types";
import { getUserById } from "../repositories/user.repository";

const chatEntityResolvers: Pick<GQLChatResolvers, keyof ChatEntity> = {
  userId: obj => obj.userId.toString(),
  firstMessage: obj => obj.firstMessage,
  dateMessage: obj => obj.dateMessage,
  amountMessage: obj => obj.amountMessage,
  isRead: obj => obj.isRead,
  createdAt: (obj) => obj.createdAt && new Date(obj.createdAt).toISOString(),
  updatedAt: (obj) => obj.updatedAt && new Date(obj.updatedAt).toISOString(),
}

export const chatResolvers: GQLChatResolvers = {
  ...chatEntityResolvers,
  user: async (obj, params, context) => (await getUserById(context.readonlyDatabase)(obj.userId))!,
}
