import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_JWT_KEY } from '../types/enums';
import { JwtPayload } from './accessToken.strategy';
import { COOKIE } from 'src/common/enums/cookie-name';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: configService.get(ENV_JWT_KEY.REFRESH_SECRET),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies[COOKIE.REFRESH]) {
      return req.cookies[COOKIE.REFRESH];
    }
    return null;
  }
}
