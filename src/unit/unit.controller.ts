import { Controller, Get, Param } from '@nestjs/common';
import { UnitService } from './unit.service';
import { Room } from '../chat/types/chat.interfaces';

@Controller()
export class UnitController {
  constructor(private unitService: UnitService) {}

  @Get('rooms')
  async getAllRooms(): Promise<Room[]> {
    return await this.unitService.getRooms();
  }

  @Get('rooms/:room')
  async getRoom(@Param() params): Promise<Room> {
    const rooms = await this.unitService.getRooms();
    const room = await this.unitService.getRoomByName(params.room);
    return rooms[room];
  }
}
