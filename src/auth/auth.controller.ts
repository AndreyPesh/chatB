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
import { Response, Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { clearCookie, setTokensToCookie } from './helpers/cookie.helper';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from './strategies/accessToken.strategy';
import { COOKIE } from 'src/common/enums/cookie-name';
import { RefreshTokenGuard } from 'src/common/guards/refreshToke.guard';

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
  async refreshToken(
    @User() user: JwtPayload,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const refreshToken = req.cookies[COOKIE.REFRESH];
    if (refreshToken) {
      const tokens = await this.authService.refreshTokens(refreshToken, user);
      setTokensToCookie(tokens, res);
      return;
    }
    throw new BadRequestException('Something went wrong!');
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@User() user: JwtPayload, @Res() res: Response) {
    await this.authService.logout(user.id);
    clearCookie(res);
  }
}
