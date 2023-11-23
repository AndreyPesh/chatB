import { Messages } from '@prisma/client';

interface RoomUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isParticipant: boolean;
  fullName: string;
  numberOfUnreadMessage: number;
}

export interface RoomData {
  id: string;
  roomName: string;
  // numberOfUnreadMessage: { userId: string; count: number }[];
  messages: Messages[];
  users: RoomUserData[];
}
