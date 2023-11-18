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
import { transformRoomWithUserData } from 'src/room/utils/transformRoomList';
import { JoinRoomData } from './types/chat.interfaces';

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
    // const socketList = await this.server.in(payload.roomName).fetchSockets();
    // this.logger.log('sockets in room ', socketList);
    return payload;
  }

  @SubscribeMessage('join_room')
  async handleJoinRoomEvent(@MessageBody() payload: JoinRoomData) {
    const { socketId, roomName, userId, participantId } = payload;
    // console.log(`join socked ID ${socketId}`);

    this.joinRoomUser(socketId, roomName);
    await this.roomService.addUsersToRoom({
      userId,
      participantId,
    });
  }

  joinRoomUser(userSocketId: string, roomName: string) {
    this.server.in(userSocketId).socketsJoin(roomName);
  }

  @SubscribeMessage('list_rooms')
  async getListRooms(
    @MessageBody()
    payload: {
      userId: string;
      socketId: string;
    },
  ) {
    const { userId, socketId } = payload;
    const roomList = await this.roomService.getAllRoomByUserId(userId);
    const transformRoomList = transformRoomWithUserData(roomList, userId);
    transformRoomList.map((room) => {
      this.joinRoomUser(socketId, room.roomName);
    });
    this.server.emit(`rooms ${userId}`, transformRoomList);
  }

  // @SubscribeMessage('join_room')
  // async handleSetClientDataEvent(
  //   @MessageBody()
  //   payload: {
  //     roomName: string;
  //     userId: string;
  //     unit: Unit;
  //   },
  // ) {
  //   if (payload.unit.socketId) {
  //     this.logger.log(
  //       `${payload.unit.socketId} is joining ${payload.roomName}`,
  //     );
  //     this.server.in(payload.unit.socketId).socketsJoin(payload.roomName);
  //     //--------------------------------------------------------------------------------------------------------
  //     // await this.unitService.addUnitToRoom(payload.roomName, payload.unit);
  //     //--------------------------------------------------------------------------------------------------------
  //     console.log(this.server);

  //     await this.roomService.addUsersToRoom({
  //       userId: payload.userId,
  //       participantId: payload.unit.unitId,
  //     });
  //     await this.sendListRooms(payload.userId);
  //   }
  // }

  // @SubscribeMessage('list_rooms')
  // async getListRooms(
  //   @MessageBody()
  //   payload: {
  //     userId: string;
  //   },
  // ) {
  //   await this.sendListRooms(payload.userId);
  // }

  // async sendListRooms(userId: string) {
  //   const roomList = await this.roomService.getAllRoomByUserId(userId);
  //   const transformRoomList = transformRoomWithUserData(roomList, userId);
  //   this.server.emit('rooms', transformRoomList);
  // }

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    await this.unitService.removeUnitFromAllRooms(socket.id);
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
