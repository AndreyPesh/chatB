import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { COOKIE } from 'src/common/enums/cookie-name';

export const setTokensToCookie = (
  tokens: { accessToken: string; refreshToken: string },
  res: Response,
) => {
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
};

export const clearCookie = (res: Response) => {
  res.cookie(COOKIE.ACCESS, '', { maxAge: 0 });
  res.cookie(COOKIE.REFRESH, '', { maxAge: 0 });
  res.cookie(COOKIE.IS_AUTH, false, { maxAge: 0 });
  res.status(HttpStatus.CREATED).json();
};
