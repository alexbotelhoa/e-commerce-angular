import { GQLConfigResolvers } from "../../resolvers-types";
import { ConfigEntity } from "../../entities/config.entity";

const configEntityResolvers: Pick<GQLConfigResolvers, keyof ConfigEntity> = {
  id: obj => obj.id.toString(),
  chatMsgBeforeQuestion: obj => obj.chatMsgBeforeQuestion,
  chatMsgAfterQuestion: obj => obj.chatMsgAfterQuestion,
  createdAt: (obj) => obj.createdAt && new Date(obj.createdAt).toISOString(),
  updatedAt: (obj) => obj.updatedAt && new Date(obj.updatedAt).toISOString(),
}

export const configResolvers: GQLConfigResolvers = {
  ...configEntityResolvers,
}
