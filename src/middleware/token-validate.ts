/**
 * @todo 光使用JWT有很多问题，这里简单起见，先这样
 */
import * as Koa from 'koa';
import jwt from 'jsonwebtoken';
import ec from '../code';
import config from '../config';
import { pathToRegexp } from 'path-to-regexp';
import { INDEX_ROUTE, STATIC_ROUTE } from '../routes/web';
import { UserInfo } from '../types/UserInfo';

const WHITE_LIST_PATHS = new Set<string>(['/user/login', '/gitlab']);

const STATIC_REGEXP = pathToRegexp(STATIC_ROUTE);

function staticPath(path: string): boolean {
  return path === INDEX_ROUTE || STATIC_REGEXP.test(path);
}

function inWhiteList(path: string): boolean {
  return WHITE_LIST_PATHS.has(path);
}

async function checkToken(token: string): Promise<UserInfo | null> {
  try {
    const userInfo = await jwt.verify(token, config.jwtKey);
    return userInfo as UserInfo;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function tokenValidate(
  ctx: Koa.Context,
  next: () => Promise<unknown>
): Promise<unknown> {
  if (inWhiteList(ctx.path) || staticPath(ctx.path)) {
    return next();
  }
  const userInfo = await checkToken(ctx.headers['x-token']);
  if (userInfo) {
    ctx.state.userInfo = userInfo;
    return next();
  }
  ctx.body = { code: ec.E_INVALID_TOKEN, msg: 'invalid token' };
}

export default function (/* opts */): Koa.Middleware {
  return tokenValidate;
}
