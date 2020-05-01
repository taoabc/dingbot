/**
 * @remark 用户管理
 */
import * as Koa from 'koa';
import KoaRouter from 'koa-router';
import jwt from 'jsonwebtoken';
import { user } from '../model';
import config from '../config';

async function logout(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  return next();
}

async function login(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  const uid = ctx.request.body.uid;
  const password = ctx.request.body.password;
  let ok = false;
  if (typeof uid === 'string' && typeof password === 'string') {
    const info = await user.login(uid, password);
    if (info != null && typeof info === 'object') {
      ctx.state.data = {
        ...info,
        token: jwt.sign({ uid }, config.jwtKey, {
          expiresIn: '7d',
        }),
      };
      ok = true;
    }
  }

  if (!ok) {
    ctx.state.code = -2;
    ctx.state.msg = 'username and password not match';
  }
  // ctx.data = await updateUser();
  return next();
}

async function add(ctx: Koa.Context, next: () => unknown): Promise<unknown> {
  const body = ctx.request.body;
  await user.add(body.uid, body.password, body.nick);
  return next();
}

export default function (): KoaRouter {
  const router = new KoaRouter();

  router.post('/user/login', login);
  router.post('/user/add', add);
  router.post('/user/logout', logout);

  return router;
}
