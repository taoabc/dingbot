import { config } from '../data';
import { RouterContext } from 'koa-router';

async function tokenValidate(ctx: RouterContext, next: () => Promise<any>) {
  if (ctx.query.token === config.token) {
    await next();
  } else {
    ctx.body = {
      code: -1,
      msg: 'invalid token',
    };
  }
}

export default function(/* opts */) {
  return tokenValidate;
}
