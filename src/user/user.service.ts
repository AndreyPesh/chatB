import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.prismaService.users.create({
      data: {
        ...createUserDto,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await this.prismaService.users.findFirst({
      where: { email },
    });
  }

  async updateUserRefreshToken(id: string, refreshToken: string) {
    return await this.prismaService.users.update({
      where: { id },
      data: {
        refreshToken,
      },
    });
  }

  find() {
    return this.prismaService.users.findMany();
  }
}
