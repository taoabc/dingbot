import * as Koa from 'koa';
import errorCode from '../code';

function output(
  ctx: Koa.Context,
  next: () => Promise<unknown>
): Promise<unknown> {
  ctx.body = {
    code: ctx.state.code || errorCode.OK,
    msg: ctx.state.msg || '',
    data: ctx.state.data,
  };
  return next();
}

export default function (/* opts */): Koa.Middleware {
  return output;
}
