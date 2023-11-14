import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoomDto } from './dto/CreateRoomDto';

@Controller('room')
export class RoomController {
  @Post('create')
  createRoom(@Body() users: CreateRoomDto) {
    console.log(users);
    return;
  }
}
