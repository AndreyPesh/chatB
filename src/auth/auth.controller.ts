import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { clearCookie, setTokensToCookie } from './helpers/cookie.helper';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from './strategies/accessToken.strategy';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';

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

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshToken(@User() user: JwtPayload,) {
    console.log(user);
    
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@User() user: JwtPayload, @Res() res: Response) {
    await this.authService.logout(user.id);
    clearCookie(res);
  }
}
