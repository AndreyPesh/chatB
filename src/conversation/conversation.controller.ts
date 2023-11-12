import { Body, Controller, Param, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { InterlocutorsData } from './dto/InterlocutorsData';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('create')
  createConversation(@Body() { userId, participantId }: InterlocutorsData) {
    return userId;
  }

  @Post(':id')
  getListConversation(@Param('id') id: string) {
    return this.conversationService.getAllConversationByUserId(id);
  }
}
