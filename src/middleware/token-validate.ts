import * as Koa from 'koa';
import { config } from '../data';
import { pathToRegexp } from 'path-to-regexp';
import { INDEX_ROUTE, STATIC_ROUTE } from '../routes/web';

const STATIC_REGEXP = pathToRegexp(STATIC_ROUTE);

function staticPath(path: string): boolean {
  return path === INDEX_ROUTE || STATIC_REGEXP.test(path);
}

function tokenValidate(
  ctx: Koa.Context,
  next: () => Promise<unknown>
): unknown {
  if (staticPath(ctx.path) || ctx.query.token === config.token) {
    return next();
  } else {
    ctx.body = {
      code: -1,
      msg: 'invalid token',
    };
  }
}

export default function (/* opts */): Koa.Middleware {
  return tokenValidate;
}
