/**
 * @remark 用户管理
 */
import * as Koa from 'koa';
import KoaRouter from 'koa-router';
// import logger from '../services/logger';
import {
  addSignKey,
  getAllSignKey,
  updateSignKey,
  removeSignKey,
} from '../model';

async function getAll(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  ctx.state.data = await getAllSignKey();
  for (const item of ctx.state.data) {
    item.signKey = undefined;
  }
  return next();
}

async function add(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  const token = ctx.request.body.token;
  const signKey = ctx.request.body.signKey;
  ctx.state.data = await addSignKey(token, signKey);
  return next();
}

async function update(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  const token = ctx.request.body.token;
  const signKey = ctx.request.body.signKey;
  ctx.state.data = await updateSignKey(token, signKey);
  return next();
}

async function remove(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  const token = ctx.request.body.token;
  ctx.state.data = await removeSignKey(token);
  return next();
}

export default function (): KoaRouter {
  const router = new KoaRouter();

  router.get('/signkey/getAll', getAll);
  router.post('/signkey/add', add);
  router.post('/signkey/update', update);
  router.post('/signkey/remove', remove);
  return router;
}
