export interface ChatEntity {
  userId: string;
  firstMessage: string;
  dateMessage: string;
  amountMessage: number;
  isRead: boolean;
  updatedAt: string;
  createdAt: string;
}

export const CHAT_TABLE = 'chat';