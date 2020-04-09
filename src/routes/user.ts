/**
 * @remark 用户管理
 */
import * as Koa from 'koa';
import KoaRouter from 'koa-router';
// import logger from '../services/logger';
import { getAllUsers, addUser } from '../model';

const PHONE_PATTERN = /^[1][3-9][0-9]{9}$/;
const PHONE_REPLACE = /(\d{3})\d{4}(\d{4})/;

async function userGetAll( //;
  ctx: Koa.Context,
  next: () => unknown
): Promise<unknown> {
  ctx.state.data = await getAllUsers();
  for (const item of ctx.state.data) {
    if (item.phone && PHONE_PATTERN.test(item.phone)) {
      item.phone = item.phone.replace(PHONE_REPLACE, '$1****$2');
    }
  }
  return next();
}

async function importUser(
  ctx: Koa.Context,
  next: () => unknown
): Promise<unknown> {
  ctx.state.data = await addUser(ctx.request.body);
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

  router.post('/user/getAll', userGetAll);
  router.post('/user/import', importUser);
  router.post('/user/update', updateUser);

  return router;
}
