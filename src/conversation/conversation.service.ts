import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InterlocutorsData } from './dto/InterlocutorsData';

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

  async startChat(interlocutorsData: InterlocutorsData) {
    const usersIdList: string[] = Object.values(interlocutorsData);
    const conversation = await this.createConversation();
    await this.addUsersToConversation(conversation.id, usersIdList);
    return conversation;
  }

  async createConversation() {
    const conversation = await this.prismaService.conversations.create({
      data: {},
    });
    return conversation;
  }

  async addUsersToConversation(conversationId: string, usersIdList: string[]) {
    const listConversations = usersIdList.map((userId) =>
      this.prismaService.usersToConversations.create({
        data: {
          user: { connect: { id: userId } },
          conversation: { connect: { id: conversationId } },
        },
      }),
    );
    return await Promise.all(listConversations);
  }
}
