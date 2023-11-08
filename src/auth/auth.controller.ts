import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { COOKIE } from 'src/common/enums/cookie-name';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  async signIn(@Body() loginUserDto: LoginDto, @Res() response: Response) {
    const tokens = await this.authService.signIn(loginUserDto);
    if (tokens) {
      this.setTokensToCookie(tokens, response);
      return;
    }
    throw new BadRequestException('Cant login!');
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    //@ts-ignore
    return this.authService.logout(req.user.id);
  }

  private setTokensToCookie(
    tokens: { accessToken: string; refreshToken: string },
    res: Response,
  ) {
    res.cookie(COOKIE.ACCESS, tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      // expires: new Date(Date.now() + 2000),
      maxAge: 1 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie(COOKIE.REFRESH, tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      // expires: new Date(Date.now() + 2000),
      maxAge: 2 * 60 * 60 * 1000,
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({ ...tokens });
  }
}
