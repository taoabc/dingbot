/**
 * @remark 用户管理
 */
// import path from 'path';
import * as Koa from 'koa';
import KoaRouter from 'koa-router';
import koaSend from 'koa-send';
import { rootPath, staticRrefix } from 'dingbot-ui';

export const INDEX_ROUTE = '/';
export const STATIC_ROUTE = `/${staticRrefix()}/:p(.+)+`;

async function sendIndex(
  ctx: Koa.Context
  // next: () => unknown
): Promise<unknown> {
  return koaSend(ctx, ctx.path, { root: rootPath(), index: 'index.html' });
  // ctx.state.data = await addUser(ctx.request.body);
  // return next();
}

async function sendStatic(
  ctx: Koa.Context
  // next: () => unknown
): Promise<unknown> {
  return koaSend(ctx, ctx.params['p'], {
    root: rootPath(),
    index: 'index.html',
  });
  // ctx.state.data = await addUser(ctx.request.body);
  // return next();
}

export default function (): KoaRouter {
  const router = new KoaRouter();

  router.get(INDEX_ROUTE, sendIndex);
  router.get(STATIC_ROUTE, sendStatic);

  return router;
}
