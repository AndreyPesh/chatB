import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENV_JWT_KEY } from '../types/enums';
import { COOKIE } from 'src/common/enums/cookie-name';

export interface JwtPayload {
  email: string;
  id: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokenStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: configService.get(ENV_JWT_KEY.ACCESS_SECRET),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies[COOKIE.ACCESS]) {
      return req.cookies[COOKIE.ACCESS];
    }
    return null;
  }
}
