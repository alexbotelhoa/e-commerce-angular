export interface ConfigEntity {
  id: string;
  chatMsgBeforeQuestion: string;
  chatMsgAfterQuestion: string;
  updatedAt: string;
  createdAt: string;
}

export const CONFIG_TABLE = 'config';
