/**
 * @remark 用户管理
 */
import * as Koa from 'koa';
import KoaRouter from 'koa-router';
// import logger from '../services/logger';
import { signKey } from '../model';

async function getAll(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  ctx.state.data = await signKey.getAll();
  for (const item of ctx.state.data) {
    item.signKey = undefined;
  }
  return next();
}

async function add(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  const token = ctx.request.body.token;
  const key = ctx.request.body.signKey;
  ctx.state.data = await signKey.add(token, key);
  return next();
}

async function update(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  const token = ctx.request.body.token;
  const signKey = ctx.request.body.signKey;
  ctx.state.data = await signKey.update(token, signKey);
  return next();
}

async function remove(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  const token = ctx.request.body.token;
  ctx.state.data = await signKey.remove(token);
  return next();
}

export default function (): KoaRouter {
  const router = new KoaRouter();

  router.post('/signkey/getAll', getAll);
  router.post('/signkey/add', add);
  router.post('/signkey/update', update);
  router.post('/signkey/remove', remove);
  return router;
}
