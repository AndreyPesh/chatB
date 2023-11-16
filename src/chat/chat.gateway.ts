import { Server, Socket } from 'socket.io';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Message,
  Unit,
} from '../common/interfaces/chat.interface';
import { UnitService } from 'src/unit/unit.service';
import { RoomService } from 'src/room/room.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private unitService: UnitService,
    private roomService: RoomService,
  ) {}

  @WebSocketServer()
  private server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  private logger = new Logger('ChatGateway');

  @SubscribeMessage('chat')
  async handleChatEvent(
    @MessageBody()
    payload: Message,
  ): Promise<Message> {
    this.logger.log(payload);
    this.server.to(payload.roomName).emit('chat', payload); // broadcast messages
    return payload;
  }

  @SubscribeMessage('join_room')
  async handleSetClientDataEvent(
    @MessageBody()
    payload: {
      roomName: string;
      userId: string;
      unit: Unit;
    },
  ) {
    if (payload.unit.socketId) {
      this.logger.log(
        `${payload.unit.socketId} is joining ${payload.roomName}`,
      );
      this.server.in(payload.unit.socketId).socketsJoin(payload.roomName);
      //--------------------------------------------------------------------------------------------------------
      await this.unitService.addUnitToRoom(payload.roomName, payload.unit);
      //--------------------------------------------------------------------------------------------------------
      await this.roomService.addUsersToRoom({
        userId: payload.userId,
        participantId: payload.unit.unitId,
      });
      this.sendListRooms();
    }
  }

  @SubscribeMessage('list_rooms')
  getListRooms() {
    this.sendListRooms();
  }

  sendListRooms() {
    this.server.emit('rooms', this.unitService.getRooms());
  }

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    await this.unitService.removeUnitFromAllRooms(socket.id);
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
