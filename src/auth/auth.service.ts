import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { ENV_JWT_KEY } from './types/enums';
import { JwtPayload } from './strategies/accessToken.strategy';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const user = await this.userService.findUserByEmail(loginDto.email);
    if (!user) throw new BadRequestException('User does not exist');

    const isPasswordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatches)
      throw new BadRequestException('Password is incorrect!');

    const tokens = await this.getTokens(user);

    this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signUp(createUserDto: CreateUserDto) {
    const isUserExists = await this.userService.findUserByEmail(
      createUserDto.email,
    );
    if (isUserExists) {
      throw new BadRequestException('User already exist');
    }
    const hashPassword = await this.hashData(createUserDto.password);
    const { firstName, lastName, email } = createUserDto;
    const user = await this.userService.createUser({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens() {}

  async logout(userId: string) {
    return await this.userService.updateUserRefreshToken(userId, {
      refreshToken: '',
    });
  }

  private async hashData(data: string) {
    const saltRounds = 10;
    return await bcrypt.hash(data, saltRounds);
  }

  async getTokens(user: Users) {
    const { email, id } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.getToken(ENV_JWT_KEY.ACCESS_SECRET, ENV_JWT_KEY.ACCESS_EXP, {
        id,
        email,
      }),
      this.getToken(ENV_JWT_KEY.REFRESH_SECRET, ENV_JWT_KEY.REFRESH_EXP, {
        id,
        email,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async getToken(
    secretKey: string,
    expire: string,
    payload: JwtPayload,
  ) {
    return this.jwtService.signAsync(
      {
        ...payload,
      },
      {
        secret: this.configService.get(secretKey),
        expiresIn: this.configService.get(expire),
      },
    );
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashToken = await this.hashData(refreshToken);
    await this.userService.updateUserRefreshToken(userId, {
      refreshToken: hashToken,
    });
  }
}
