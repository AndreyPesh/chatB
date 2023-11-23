import { Messages, Users } from '@prisma/client';
import { RoomData } from '../types/room.interface';
import { ListRoomDataDb, RoomDataDb } from '../types/room.types';

const unreadMessageCounter = (messages: Messages[], userId: string) => {
  return messages.reduce((counter, message) => {
    if (!message.isReaded && message.authorId !== userId) {
      return (counter += 1);
    }
    return counter;
  }, 0);
};

const shapeUserData = (
  usersInRoom: { user: Users }[],
  messages: Messages[],
  currentUserId: string,
) => {
  return usersInRoom.map(({ user }) => {
    const { id, firstName, lastName, email } = user;
    const fullName = firstName + ' ' + lastName;
    const isParticipant = currentUserId !== id;
    const numberOfUnreadMessage = unreadMessageCounter(messages, id);
    return {
      id,
      firstName,
      lastName,
      email,
      fullName,
      isParticipant,
      numberOfUnreadMessage,
    };
  });
};

export const transformRoomWithUserData = (
  listRooms: ListRoomDataDb,
  currentUserId: string,
): RoomData[] => {
  const roomList = listRooms.map(({ room }) => {
    const { id, messages, name } = room;
    const users = shapeUserData(room.users, messages, currentUserId);
    return { id, roomName: name, messages, users };
  });
  return roomList;
};

export const transformRoomWithUnreadMessage = (
  room: RoomDataDb,
  currentUserId: string,
): RoomData => {
  const { id, messages, name } = room;
  const users = shapeUserData(room.users, messages, currentUserId);
  return { id, roomName: name, messages, users };
};
