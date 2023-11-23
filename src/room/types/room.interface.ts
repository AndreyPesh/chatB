import { Messages } from '@prisma/client';

interface RoomUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  numberOfUnreadMessage: number;
}

export interface RoomData {
  id: string;
  roomName: string;
  messages: Messages[];
  users: RoomUserData[];
}
