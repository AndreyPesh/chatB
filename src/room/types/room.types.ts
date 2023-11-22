import { RoomService } from '../room.service';

export type ListRoomData = Awaited<
  ReturnType<RoomService['getAllRoomByUserIdFromDB']>
>;

export type RoomDataDb = Awaited<ReturnType<RoomService['getRoomMessageById']>>;
