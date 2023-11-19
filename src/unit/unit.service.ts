import { Injectable } from '@nestjs/common';
import { Room, Unit } from '../chat/types/chat.interfaces';

@Injectable()
export class UnitService {
  private rooms: Room[] = [];

  async addRoom(roomName: string, host: Unit): Promise<void> {
    const room = await this.getRoomByName(roomName);
    if (room === -1) {
      await this.rooms.push({ name: roomName, host, units: [host] });
    }
  }

  async removeRoom(roomName: string): Promise<void> {
    const findRoom = await this.getRoomByName(roomName);
    if (findRoom !== -1) {
      this.rooms = this.rooms.filter((room) => room.name !== roomName);
    }
  }

  async getRoomHost(hostName: string): Promise<Unit> {
    const roomIndex = await this.getRoomByName(hostName);
    return this.rooms[roomIndex].host;
  }

  async getRoomByName(roomName: string): Promise<number> {
    const roomIndex = this.rooms.findIndex((room) => room?.name === roomName);
    return roomIndex;
  }

  async addUnitToRoom(roomName: string, unit: Unit): Promise<void> {
    const roomIndex = await this.getRoomByName(roomName);
    if (roomIndex !== -1) {
      this.rooms[roomIndex].units.push(unit);
      const host = await this.getRoomHost(roomName);
      if (host.unitId === unit.unitId) {
        this.rooms[roomIndex].host.socketId = unit.socketId;
      }
    } else {
      await this.addRoom(roomName, unit);
    }
  }

  async findRoomsByUnitSocketId(socketId: string): Promise<Room[]> {
    const filteredRooms = this.rooms.filter((room) => {
      const found = room.units.find((unit) => unit.socketId === socketId);
      if (found) {
        return found;
      }
    });
    return filteredRooms;
  }

  async removeUnitFromAllRooms(socketId: string): Promise<void> {
    const rooms = await this.findRoomsByUnitSocketId(socketId);
    for (const room of rooms) {
      await this.removeUnitFromRoom(socketId, room.name);
    }
  }

  async removeUnitFromRoom(socketId: string, roomName: string): Promise<void> {
    const room = await this.getRoomByName(roomName);
    this.rooms[room].units = this.rooms[room].units.filter(
      (unit) => unit.socketId !== socketId,
    );
    if (this.rooms[room].units.length === 0) {
      await this.removeRoom(roomName);
    }
  }

  getRooms(): Room[] {
    return this.rooms;
  }
}
