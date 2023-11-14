import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UnitModule } from 'src/unit/unit.module';

@Module({
  imports: [UnitModule],
  providers: [ChatGateway],
})
export class ChatModule {}
