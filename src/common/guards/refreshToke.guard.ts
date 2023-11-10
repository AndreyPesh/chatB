import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { COOKIE } from '../enums/cookie-name';
import { ConfigService } from '@nestjs/config';
import { ENV_JWT_KEY } from 'src/auth/types/enums';
import { JwtPayload } from 'src/auth/strategies/accessToken.strategy';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ForbiddenException();
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get(ENV_JWT_KEY.REFRESH_SECRET),
      });
      request['user'] = payload;
    } catch {
      request.res.cookie(COOKIE.IS_AUTH, false);
      request.res.cookie(COOKIE.ACCESS, '', {maxAge: 1});
      request.res.cookie(COOKIE.REFRESH, '', {maxAge: 1});
      throw new ForbiddenException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const refreshToken = request.cookies[COOKIE.REFRESH] ?? null;
    return refreshToken;
  }
}
