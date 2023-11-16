import { RoomService } from '../room.service';

export type listRoomData = Awaited<
  ReturnType<RoomService['getAllRoomByUserId']>
>;
