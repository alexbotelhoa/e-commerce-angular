import { GQLMutationResolvers } from "../../../resolvers-types";
import { updateChat } from "../../../shared/repositories/chat.repository";

export const chatMakeReadResolver: GQLMutationResolvers["chatMakeRead"] = async (_, __, context) => {
  const currentUser = context.currentUser;
  if (!currentUser) {
    throw new Error('User not found');
  }

  const affectRows = await updateChat(context.database)({
    isRead: true
  })(builder => 
    builder.where({ userId: currentUser.id })
  );

  return affectRows > 0;
}