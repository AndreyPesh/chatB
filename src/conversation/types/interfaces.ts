import { Messages } from '@prisma/client';

interface ConversationUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ConversationData {
  id: string;
  messages: Messages[];
  users: ConversationUserData[];
}
