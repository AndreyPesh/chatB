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

export interface UpdateRoomPayload {
  roomId: string;
  roomName: string;
  currentUserId: string;
}

export interface MessagePayload {
  authorId: string;
  message: string;
  roomName: string;
  roomId: string;
}

export interface ReadMessagePayload {
  roomName: string;
  roomId: string;
  authorId: string;
  currentUserId: string;
}

export interface ServerToClientEvents {
  chat: (e: MessagePayload) => void;
}

export interface ClientToServerEvents {
  // chat: (e: Message) => void;
  // join_room: (e: { unit: Unit; roomName: string }) => void;
}

//-------------------------
export interface Unit {
  unitId: string;
  unitName: string;
  socketId: string;
}

export interface Room {
  name: string;
  host: Unit;
  units: Unit[];
}
