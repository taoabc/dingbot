/**
 * @remark 用户管理
 */
import * as Koa from 'koa';
import KoaRouter from 'koa-router';
import jwt from 'jsonwebtoken';
import config from '../config';

async function logout(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  return next();
}

async function login(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  ctx.state.data = jwt.sign({ uid: 'asdf' }, config.jwtKey, {
    expiresIn: '7d',
  });
  // ctx.data = await updateUser();
  return next();
}

export default function (): KoaRouter {
  const router = new KoaRouter();

  router.post('/user/login', login);
  router.post('/user/logout', logout);

  return router;
}
