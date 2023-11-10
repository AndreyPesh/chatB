import { Controller, Param, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post(':id')
  getListConversation(@Param('id') id: string) {
    return this.conversationService.getAllConversationByUserId(id);
  }
}
