import { Messages } from '@prisma/client';

interface RoomUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isParticipant: boolean;
  fullName: string;
}

export interface RoomData {
  id: string;
  roomName: string;
  numberOfUnreadMessage: number;
  messages: Messages[];
  users: RoomUserData[];
}
