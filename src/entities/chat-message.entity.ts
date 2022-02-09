export interface ChatMessageEntity {
  id: string;
  userId: string;
  isEtutor: boolean;
  levelCodeId: string;
  levelCodeName: string;
  levelThemeId: string;
  levelThemeName: string;
  cycleActivityId: string;
  cycleActivityName: string;
  message: string;
}

export const CHAT_MESSAGE_TABLE = 'chat_message';
