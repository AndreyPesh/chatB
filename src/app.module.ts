import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { ConversationModule } from './conversation/conversation.module';
import { ChatModule } from './chat/chat.module';
import { UnitModule } from './unit/unit.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, AuthModule, ChatModule, UnitModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
