import { Messages, Users } from '@prisma/client';
import { RoomData } from '../types/room.interface';
import { ListRoomData, RoomDataDb } from '../types/room.types';

const unreadMessageCounter = (messages: Messages[], currentUserId: string) => {
  console.log('userID ', currentUserId);

  return messages.reduce((counter, message) => {
    if (!message.isReaded && message.authorId !== currentUserId) {
      return (counter += 1);
    }
    return counter;
  }, 0);
};

const shapeUserData = (
  usersInRoom: { user: Users }[],
  currentUserId: string,
) => {
  return usersInRoom.map(({ user }) => {
    const { id, firstName, lastName, email } = user;
    const fullName = firstName + ' ' + lastName;
    const isParticipant = currentUserId !== id;
    return {
      id,
      firstName,
      lastName,
      email,
      fullName,
      isParticipant,
    };
  });
};

export const transformRoomWithUserData = (
  listRooms: ListRoomData,
  currentUserId: string,
): RoomData[] => {
  const roomList = listRooms.map(({ room }) => {
    const { id, messages, name } = room;
    const numberOfUnreadMessage = unreadMessageCounter(messages, currentUserId);
    const users = shapeUserData(room.users, currentUserId);
    return { id, roomName: name, messages, numberOfUnreadMessage, users };
  });
  return roomList;
};

export const transformRoomWithUnreadMessage = (
  room: RoomDataDb,
  currentUserId: string,
) => {
  const { id, messages, name } = room;
  const numberOfUnreadMessage = unreadMessageCounter(messages, currentUserId);
  return { id, roomName: name, messages, numberOfUnreadMessage };
};
