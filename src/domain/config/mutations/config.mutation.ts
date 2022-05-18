import { ConfigEntity } from "../../../entities/config.entity";
import { GQLMutationResolvers } from "../../../resolvers-types";
import { selectConfig, updateConfig, deleteAllConfigs, insertConfig } from "../../../shared/repositories/config.repository";

export const configMutationResolver: GQLMutationResolvers["updateConfig"] = async (_, { payload }, context) => {
  const user = context.currentUser;

  if (!user) {
    throw new Error('User not authorized');
  }

  const existConfig = await selectConfig(context.readonlyDatabase);

  if (existConfig && existConfig.length === 1) {
    await updateConfig(context.database)({
      chatMsgBeforeQuestion: payload.chatMsgBeforeQuestion,
      chatMsgAfterQuestion: payload.chatMsgAfterQuestion
    } as ConfigEntity)(builder => builder.where('id', existConfig[0].id));
    return true;
  }

  await context.database.transaction(async trx => {
    await deleteAllConfigs(trx);
    await insertConfig(trx)({
      chatMsgBeforeQuestion: payload.chatMsgBeforeQuestion,
      chatMsgAfterQuestion: payload.chatMsgAfterQuestion
    } as ConfigEntity);
  });
  return true;
};
