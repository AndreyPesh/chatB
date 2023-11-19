import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/CreateRoomDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { transformRoomWithUserData } from './utils/transformRoomList';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllRoomByUserIdFromDB(userId: string) {
    const listAllUserRoom = await this.prismaService.usersToRoom.findMany({
      where: {
        userId,
      },
      include: {
        room: {
          include: {
            users: { include: { user: true } },
            messages: true,
          },
        },
      },
    });

    return listAllUserRoom;
  }

  async getAllRoomByUserId(userId: string) {
    const userRoomList = await this.getAllRoomByUserIdFromDB(userId);
    const transformRoomList = transformRoomWithUserData(userRoomList, userId);
    return transformRoomList;
  }

  async createRoom(roomName: string) {
    const room = await this.prismaService.room.create({
      data: {
        name: roomName,
      },
    });
    return room;
  }

  async addUserToRoomById(userId: string, roomId: string) {
    await this.prismaService.usersToRoom.create({
      data: {
        user: {
          connect: { id: userId },
        },
        room: {
          connect: { id: roomId },
        },
      },
    });
  }

  async addUsersToRoom({ userId, participantId, roomName }: CreateRoomDto) {
    const isRoomExist = await this.isRoomExist(roomName);
    if (isRoomExist) {
      return false;
    }

    const room = await this.createRoom(roomName);
    const listIdInterlocutors = Object.values({ userId, participantId });
    await Promise.all(
      listIdInterlocutors.map((userId) =>
        this.addUserToRoomById(userId, room.id),
      ),
    );
    return true;
  }

  async isRoomExist(roomName: string) {
    const room = await this.prismaService.room.findFirst({
      where: {
        name: roomName,
      },
    });
    return room ? true : false;
  }
}
