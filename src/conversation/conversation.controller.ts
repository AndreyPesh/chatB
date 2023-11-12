import { Body, Controller, Param, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { InterlocutorsData } from './dto/InterlocutorsData';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('create')
  async createConversation(@Body() interlocutorsData: InterlocutorsData) {
    const conversation =
      await this.conversationService.startChat(interlocutorsData);
    return conversation;
  }

  @Post(':id')
  getListConversation(@Param('id') id: string) {
    return this.conversationService.getAllConversationByUserId(id);
  }
}
