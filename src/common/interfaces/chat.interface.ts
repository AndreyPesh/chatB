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

export interface Message {
  unit: Unit;
  timeSent: string;
  message: string;
  roomName: string;
}

export interface ServerToClientEvents {
  chat: (e: Message) => void;
}

export interface ClientToServerEvents {
  chat: (e: Message) => void;
  join_room: (e: { unit: Unit; roomName: string }) => void;
}
