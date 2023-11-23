import { RoomService } from '../room.service';

export type ListRoomDataDb = Awaited<
  ReturnType<RoomService['getAllRoomByUserIdFromDB']>
>;

export type RoomDataDb = Awaited<ReturnType<RoomService['getRoomMessageById']>>;
