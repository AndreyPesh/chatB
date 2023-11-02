import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/user-dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private userDB: PrismaService) {}

  async login(loginUserData: LoginUserDto) {
    const { login, password } = loginUserData;
    await this.userDB.users.create({
      data: {
        firstName: login,
        lastName: login,
        password: password,
      },
    });
  }

  find() {
    return this.userDB.users.findMany();
  }
}
