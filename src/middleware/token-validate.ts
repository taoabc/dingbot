import * as Koa from 'koa';
import { config } from '../data';

function tokenValidate(
  ctx: Koa.Context,
  next: () => Promise<unknown>
): unknown {
  if (ctx.query.token === config.token) {
    return next();
  } else {
    ctx.body = {
      code: -1,
      msg: 'invalid token'
    };
  }
}

export default function(/* opts */): Koa.Middleware {
  return tokenValidate;
}
