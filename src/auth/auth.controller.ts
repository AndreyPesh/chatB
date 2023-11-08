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
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const tokens = await this.authService.signUp(createUserDto);
    if (tokens) {
      this.setTokensToCookie(tokens, response);
      return;
    }
    throw new BadRequestException('Cant login!');
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
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log(req.user);

    //@ts-ignore
    await this.authService.logout(req.user.id);
    this.clearCookie(res);
  }

  private setTokensToCookie(
    tokens: { accessToken: string; refreshToken: string },
    res: Response,
  ) {
    res.cookie(COOKIE.ACCESS, tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      // expires: new Date(Date.now() + 2000),
      maxAge: 12 * 60 * 60 * 1000, //12 hours
      path: '/',
    });
    res.cookie(COOKIE.REFRESH, tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      // expires: new Date(Date.now() + 2000),
      maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
      path: '/',
    });
    res.cookie(COOKIE.IS_AUTH, true, {
      httpOnly: false,
      sameSite: 'lax',
      // expires: new Date(Date.now() + 2000),
      maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({ ...tokens });
  }

  private clearCookie(res: Response) {
    res.cookie(COOKIE.ACCESS, '', { maxAge: 0 });
    res.cookie(COOKIE.REFRESH, '', { maxAge: 0 });
    res.cookie(COOKIE.IS_AUTH, false, { maxAge: 0 });
    res.status(HttpStatus.CREATED).json();
  }
}
