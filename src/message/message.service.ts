import { Injectable } from '@nestjs/common';
import { MessagePayload } from 'src/chat/types/chat.interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveMessage(messageData: MessagePayload) {
    const { message: content, authorId, roomId } = messageData;
    const message = await this.prismaService.messages.create({
      data: {
        content,
        author: {
          connect: { id: authorId },
        },
        room: {
          connect: { id: roomId },
        },
      },
    });
    return message;
  }
}
