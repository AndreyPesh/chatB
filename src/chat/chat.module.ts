import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UnitModule } from 'src/unit/unit.module';
import { RoomModule } from 'src/room/room.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [UnitModule, RoomModule, MessageModule],
  providers: [ChatGateway],
})
export class ChatModule {}
