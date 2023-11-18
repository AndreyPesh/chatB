import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/CreateRoomDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllRoomByUserId(userId: string) {
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

  async createRoom({ userId, participantId }: CreateRoomDto) {
    const room = await this.prismaService.room.create({
      data: {
        name: `${participantId} ${userId}`,
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

  async addUsersToRoom({ userId, participantId }: CreateRoomDto) {
    const room = await this.createRoom({ userId, participantId });
    const listIdInterlocutors = Object.values({ userId, participantId });
    Promise.all(
      listIdInterlocutors.map((userId) =>
        this.addUserToRoomById(userId, room.id),
      ),
    );
  }
}
