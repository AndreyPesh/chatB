import { ConversationData } from '../types/interfaces';
import { listConversationsData } from '../types/types';

export const transformConversationsWithUserData = (
  listConversations: listConversationsData,
): ConversationData[] => {
  const conversationList = listConversations.map(({ conversation }) => {
    const { id, messages } = conversation;
    const users = conversation.users.map(({ user }) => {
      const { id, firstName, lastName, email } = user;
      return { id, firstName, lastName, email };
    });
    return { id, messages, users };
  });
  return conversationList;
};
