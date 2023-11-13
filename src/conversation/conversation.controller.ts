import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { InterlocutorsData } from './dto/InterlocutorsData';
import { transformConversationsWithUserData } from './helpers/transformConversationWithUsersData';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('create')
  async createConversation(@Body() interlocutorsData: InterlocutorsData) {
    const conversation =
      await this.conversationService.startChat(interlocutorsData);
    return conversation;
  }

  @Get('list/:id')
  async getListConversation(@Param('id') id: string) {
    const conversations =
      await this.conversationService.getAllConversationByUserId(id);
    return transformConversationsWithUserData(conversations, id);
  }
}
