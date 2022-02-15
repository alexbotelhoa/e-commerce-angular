import { ChatMessageEntity } from "../../../entities/chat-message.entity";
import { ChatEntity } from "../../../entities/chat.entity";
import { GQLMutationResolvers, RoleId } from "../../../resolvers-types";
import { getActivityById } from "../../../shared/repositories/activity.repository";
import { insertChatMessage } from "../../../shared/repositories/chat-message.repository";
import { insertChat, getChatById, updateChat } from "../../../shared/repositories/chat.repository";
import { getClassById } from "../../../shared/repositories/class.repository";
import { getCycleActivityById } from "../../../shared/repositories/cycle-activity.repository";
import { getCycleById } from "../../../shared/repositories/cycle.repository";
import { getLevelCodeById } from "../../../shared/repositories/level-code.repository";
import { getLevelThemeById } from "../../../shared/repositories/level-theme.repository";
import { getThemeById } from "../../../shared/repositories/theme.repository";
import { selectUserRole } from "../../../shared/repositories/user-role.repository";

export const messageResolver: GQLMutationResolvers["insertChat"] = async (_, { payload }, context) => {
  const user = context.currentUser;
  const idRoleSendMessage = payload.isEtutor ? RoleId['E_TUTOR'] : RoleId['STUDENT'];
  const dateNow = new Date();

  const userLogeedRoles = await selectUserRole(context.readonlyDatabase).where({ userId: user?.id });

  const isInvalidEtutor = idRoleSendMessage === RoleId['E_TUTOR'] && !userLogeedRoles.map(r => r.roleId).includes(RoleId['E_TUTOR']);
  const isInvalidStutent = idRoleSendMessage === RoleId['STUDENT'] && !userLogeedRoles.map(r => r.roleId).find(id => id === RoleId['STUDENT'] || id === RoleId['HORIZON_ONE']);

  const isInvalid = [
    !user?.id,
    isInvalidEtutor,
    isInvalidStutent
  ];

  if(isInvalid.some(isInvalid => isInvalid)) {
    throw new Error('Invalid user');
  }

  const existingChat = await getChatById(context.readonlyDatabase)(payload.userId as string);

  if (!existingChat && idRoleSendMessage === RoleId['E_TUTOR']) {
    throw new Error('you are not allowed to start a chat');
  }

  if (!existingChat) {
    await insertChat(context.database)({
      userId: user?.id,
      firstMessage: payload.message?.replace(/<[^>]*>/g, '').slice(0, 100),
      dateMessage: dateNow.toISOString(),
      amountMessage: 1,
      isRead: false //controla se o aluno viu a notificação
    } as ChatEntity);
  }
  else {
    const valuesOfUpdate: Partial<ChatEntity> = {};

    if (idRoleSendMessage === RoleId['E_TUTOR']) {
      valuesOfUpdate.amountMessage = 0;
      valuesOfUpdate.isRead = false;
    }

    if (idRoleSendMessage === RoleId['STUDENT']) {
      valuesOfUpdate.amountMessage = existingChat.amountMessage +1;
      valuesOfUpdate.isRead = true;

      if (valuesOfUpdate.amountMessage === 1) {
        valuesOfUpdate.firstMessage = payload.message?.replace(/<[^>]*>/g, '').slice(0, 100);
        valuesOfUpdate.dateMessage = dateNow.toISOString();
      }
    }

    await updateChat(context.database)(valuesOfUpdate)(builder => 
      builder.andWhere('userId', existingChat.userId)
    );
  }

  const message = {
    userId: payload.userId?.toString(),
    isEtutor: payload.isEtutor,
    message: payload.message,
  } as ChatMessageEntity;

  if (payload.classId && payload.cycleActivityId && payload.levelThemeId) {
    const cycleActivity = await getCycleActivityById(context.readonlyDatabase)(payload.cycleActivityId);
    const classe = await getClassById(context.readonlyDatabase)(payload.classId);
    const levelCode = await getLevelCodeById(context.readonlyDatabase)(classe?.levelCodeId || 0);
    const levelTheme = await getLevelThemeById(context.readonlyDatabase)(payload.levelThemeId);
    const theme = await getThemeById(context.readonlyDatabase)(levelTheme?.themeId || 0);
    const cycle = await getCycleById(context.readonlyDatabase)(cycleActivity?.cycleId || 0);
    const activity = await getActivityById(context.readonlyDatabase)(cycleActivity?.activityId || 0);

    if (!classe || !cycleActivity || !levelCode || !theme || !cycle || !activity) {
      throw new Error('');
    }

    message.levelThemeId = payload.levelThemeId.toString();
    message.cycleActivityId = cycleActivity.id.toString();
    message.levelCodeId = levelCode.id.toString();
    message.levelCodeName = levelCode.code;
    message.levelThemeName = theme.name;
    message.cycleActivityName = cycle.name;
    message.activityName = activity.name;
  }

  await insertChatMessage(context.database)(message);

  return true;
};
