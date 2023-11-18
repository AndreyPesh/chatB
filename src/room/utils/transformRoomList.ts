import { RoomData } from '../types/room.interface';
import { listRoomData } from '../types/room.types';

export const transformRoomWithUserData = (
  listRooms: listRoomData,
  currentUserId: string,
): RoomData[] => {
  const roomList = listRooms.map(({ room }) => {
    const { id, messages, name } = room;
    const users = room.users.map(({ user }) => {
      const { id, firstName, lastName, email } = user;
      const fullName = firstName + ' ' + lastName;
      const isParticipant = currentUserId !== id;
      return { id, firstName, lastName, email, fullName, isParticipant };
    });
    return { id, roomName: name, messages, users };
  });
  return roomList;
};


