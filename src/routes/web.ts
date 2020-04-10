/**
 * @remark 用户管理
 */
import * as Koa from 'koa';
import KoaRouter from 'koa-router';

async function importUser(
  ctx: Koa.Context,
  next: () => unknown
): Promise<unknown> {
  // ctx.state.data = await addUser(ctx.request.body);
  return next();
}

async function updateUser(
  ctx: Koa.Context,
  next: () => unknown
): Promise<unknown> {
  ctx.state.data = 'haha';
  // ctx.data = await updateUser();
  return next();
}

export default function (): KoaRouter {
  const router = new KoaRouter();

  router.get('/', userGetAll);

  return router;
}
