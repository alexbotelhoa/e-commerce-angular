import { createRepository } from "../services/repository.service";
import { ChatMessageEntity, CHAT_MESSAGE_TABLE } from "../../entities/chat-message.entity";

export const {
    getById: getChatMessageById,
    getManyByIds: getChatMessagesByIds,
    select: selectChatMessage,
    insert: insertChatMessage,
    update: updateChatMessage,
    delete: deleteChatMessage,
    deleteAll: deleteAllChatMessages,
    count: countChatMessages,
} = createRepository<ChatMessageEntity>(CHAT_MESSAGE_TABLE, 'id');
