import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { clearCookie, setTokensToCookie } from './helpers/cookie.helper';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const tokens = await this.authService.signUp(createUserDto);
    if (tokens) {
      setTokensToCookie(tokens, response);
      return;
    }
    throw new BadRequestException('Cant register!');
  }

  @Post('login')
  async signIn(@Body() loginUserDto: LoginDto, @Res() response: Response) {
    const tokens = await this.authService.signIn(loginUserDto);
    if (tokens) {
      setTokensToCookie(tokens, response);
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
    clearCookie(res);
  }
}
