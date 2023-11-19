export interface JoinRoomPayload {
  roomName: string;
  userId: string;
  socketId: string;
  participantId: string;
}

export interface GetListRoomPayload {
  userId: string;
  socketId: string;
}
