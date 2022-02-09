import { createRepository } from "../services/repository.service";
import { ChatEntity, CHAT_TABLE } from "../../entities/chat.entity";

export const {
    getById: getChatById,
    getManyByIds: getChatsByIds,
    select: selectChat,
    insert: insertChat,
    update: updateChat,
    delete: deleteChat,
    deleteAll: deleteAllChats,
    count: countChats,
} = createRepository<ChatEntity>(CHAT_TABLE, 'id');
