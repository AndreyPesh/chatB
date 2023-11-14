// import { ConversationData } from '../types/interfaces';
// import { listConversationsData } from '../types/types';

// export const transformConversationsWithUserData = (
//   listConversations: listConversationsData,
//   currentUserId: string,
// ): ConversationData[] => {
//   const conversationList = listConversations.map(({ conversation }) => {
//     const { id, messages } = conversation;
//     const users = conversation.users.map(({ user }) => {
//       const { id, firstName, lastName, email } = user;
//       const fullName = firstName + ' ' + lastName;
//       const isParticipant = currentUserId !== id;
//       return { id, firstName, lastName, email, fullName, isParticipant };
//     });
//     return { id, messages, users };
//   });
//   return conversationList;
// };
