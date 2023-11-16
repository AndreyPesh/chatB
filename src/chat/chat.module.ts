import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UnitModule } from 'src/unit/unit.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [UnitModule, RoomModule],
  providers: [ChatGateway],
})
export class ChatModule {}
