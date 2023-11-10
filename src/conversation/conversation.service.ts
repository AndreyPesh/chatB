import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllConversationByUserId(userId: string) {
    return await this.prismaService.usersToConversations.findMany({
      where: {
        userId,
      },
    });
  }
}
