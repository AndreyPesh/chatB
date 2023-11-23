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
  MessagePayload,
  UpdateRoomPayload,
  ReadMessagePayload,
} from './types/chat.interfaces';
import { UnitService } from 'src/unit/unit.service';
import { RoomService } from 'src/room/room.service';
import { GetListRoomPayload, JoinRoomPayload } from './types/chat.interfaces';
import { CHAT_EVENTS } from './types/chat.enums';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private unitService: UnitService,
    private roomService: RoomService,
    private messageService: MessageService,
  ) {}

  @WebSocketServer()
  private server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  private logger = new Logger('ChatGateway');

  @SubscribeMessage(CHAT_EVENTS.SEND_MESSAGE)
  async handleChatEvent(
    @MessageBody()
    messagePayload: MessagePayload,
  ) {
    // this.logger.log(messagePayload);
    const { roomId, roomName, authorId } = messagePayload;

    const message = await this.messageService.saveMessage(messagePayload);

    if (message) {
      this.getRoomByIdAndSend(roomId, roomName, authorId);
      // this.server.to(roomName).emit(CHAT_EVENTS.GET_MESSAGE, message, {
      //   roomId,
      //   roomName,
      // });
      // return messagePayload;
    }
  }

  @SubscribeMessage(CHAT_EVENTS.JOIN_USER_TO_ROOM)
  async handleJoinRoomEvent(@MessageBody() payload: JoinRoomPayload) {
    const { socketId, roomName, userId, participantId } = payload;
    const isUserAddedToRoom = await this.roomService.addUsersToRoom({
      userId,
      participantId,
      roomName,
    });
    if (isUserAddedToRoom) this.joinRoomUser(socketId, roomName);
    return isUserAddedToRoom;
  }

  joinRoomUser(userSocketId: string, roomName: string) {
    this.server.in(userSocketId).socketsJoin(roomName);
  }

  @SubscribeMessage(CHAT_EVENTS.USER_LIST_ROOM)
  async getListRooms(@MessageBody() payload: GetListRoomPayload) {
    const { userId, socketId } = payload;

    if (!userId || !socketId) {
      return false;
    }

    const userRoomsList = await this.roomService.getAllRoomByUserId(userId);

    userRoomsList.map((room) => {
      this.joinRoomUser(socketId, room.roomName);
    });
    return userRoomsList;
  }

  // @SubscribeMessage(CHAT_EVENTS.UPDATE_ROOM_EMIT)
  // async updateRoomById(@MessageBody() updateRoomPayload: UpdateRoomPayload) {
  //   const { roomId, roomName, currentUserId } = updateRoomPayload;
  //   this.getRoomByIdAndSend(roomId, roomName, currentUserId);
  // }

  @SubscribeMessage(CHAT_EVENTS.READ_MESSAGE_EMIT)
  async readMessage(@MessageBody() readMessagePayload: ReadMessagePayload) {
    const { roomId, roomName, authorId, currentUserId } = readMessagePayload;
    const isMessagesReaded = await this.roomService.MarkAsReadMessage(
      roomId,
      authorId,
    );
    if (isMessagesReaded) {
      this.getRoomByIdAndSend(roomId, roomName, currentUserId);
    }
  }

  async getRoomByIdAndSend(
    roomId: string,
    roomName: string,
    currentUserId: string,
  ) {
    const room = await this.roomService.getRoomMessageWithUnreadMessageById(
      roomId,
      currentUserId,
    );
    this.server.to(roomName).emit(CHAT_EVENTS.UPDATE_ROOM_LISTENER, room);
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
