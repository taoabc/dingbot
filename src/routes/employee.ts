/**
 * @remark 用户管理
 */
import * as Koa from 'koa';
import KoaRouter from 'koa-router';
// import logger from '../services/logger';
import { employee } from '../model';
import err from '../code';

const PHONE_PATTERN = /^[1][3-9][0-9]{9}$/;
const PHONE_REPLACE = /(\d{3})\d{4}(\d{4})/;

async function getAll(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  //;
  ctx.state.data = await employee.getAll();
  for (const item of ctx.state.data) {
    if (item.phone && PHONE_PATTERN.test(item.phone)) {
      item.phone = item.phone.replace(PHONE_REPLACE, '$1****$2');
    }
  }
  return next();
}

async function add(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  ctx.state.data = await employee.add(ctx.request.body);
  return next();
}

async function update(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  const ret = await employee.update(ctx.request.body);
  if (!ret) {
    ctx.state.code = err.E_UNKNOWN;
    ctx.state.msg = 'update fail';
  }
  return next();
}

async function remove(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  const ret = await employee.remove(ctx.request.body.userName);
  if (!ret) {
    ctx.state.code = err.E_UNKNOWN;
    ctx.state.msg = 'remove fail';
  }
  return next();
}

export default function (): KoaRouter {
  const router = new KoaRouter();

  router.post('/employee/getAll', getAll);
  router.post('/employee/add', add);
  router.post('/employee/update', update);
  router.post('/employee/remove', remove);

  return router;
}
