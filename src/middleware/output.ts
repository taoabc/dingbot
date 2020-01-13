import * as Koa from 'koa';
function output(
  ctx: Koa.Context,
  next: () => Promise<unknown>
): Promise<unknown> {
  ctx.body = {
    code: ctx.state.code || 0,
    msg: ctx.state.msg || 'ok',
    data: ctx.state.data
  };
  return next();
}

export default function(/* opts */): Koa.Middleware {
  return output;
}
