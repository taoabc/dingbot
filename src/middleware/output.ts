import { RouterContext } from 'koa-router';
async function output(ctx: RouterContext, next: () => Promise<any>) {
  ctx.body = {
    code: ctx.state.code || 0,
    msg: ctx.state.msg || 'ok',
    data: ctx.state.data,
  };
  await next();
}

export default function(/* opts */) {
  return output;
}
