import { ChatMessageEntity } from "../../../entities/chat-message.entity";
import { ChatEntity } from "../../../entities/chat.entity";
import { GQLMutationResolvers, RoleId } from "../../../resolvers-types";
import { insertChatMessage } from "../../../shared/repositories/chat-message.repository";
import { insertChat, getChatById, updateChat } from "../../../shared/repositories/chat.repository";

export const messageResolver: GQLMutationResolvers["insertChat"] = async (_, { payload }, context) => {
  const user = context.currentUser;
  const idRole = payload.isEtutor ? RoleId['E_TUTOR'] : RoleId['STUDENT'];

  const isInvalid = [
    !payload,
    !user?.id,
    idRole === RoleId['E_TUTOR'] && !user?.roleIds.includes(RoleId['E_TUTOR']),
    idRole === RoleId['STUDENT'] && !user?.roleIds.includes(RoleId['STUDENT'])
  ];

  if(isInvalid.some(isInvalid => isInvalid)) {
    throw new Error('Invalid user');
  }

  const existingChat = await getChatById(context.readonlyDatabase)('');

  if (!existingChat && idRole === RoleId['E_TUTOR']) {
    throw new Error('you are not allowed to start a chat');
  }

  if (!existingChat) {
    await insertChat(context.database)({
      userId: user?.id,
      firstMessage: payload.message?.replace(/<[^>]*>/g, '').slice(0, 100),
      dateMessage: (new Date()).toUTCString(),
      amountMessage: 1,
      isRead: false //controla se o aluno viu a notificação
    } as ChatEntity);
  }
  else {
    await updateChat(context.database)({
      amountMessage: payload.isEtutor ? 0 : existingChat.amountMessage +1,
      isRead: !payload.isEtutor // seta como read tru se o aluno enviar uma nova mensagem;
    })(builder => 
      builder.andWhere('userId', existingChat.userId)
    );
  }

  await insertChatMessage(context.database)({
    userId: payload.userId,
    isEtutor: payload.isEtutor,
    levelCodeId: payload.levelCodeId,
    levelCodeName: payload.levelCodeName,
    levelThemeId: payload.levelThemeId,
    levelThemeName: payload.levelThemeName,
    cycleActivityId: payload.cycleActivityId,
    cycleActivityName: payload.cycleActivityName,
    message: payload.message,
  } as ChatMessageEntity);

  return true;
};
