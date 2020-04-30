import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import tokenValidate from './middleware/token-validate';
import output from './middleware/output';
import gitlabRouter from './routes/gitlab';
import userRouter from './routes/employee';
import signKeyRouter from './routes/sign-key';
import web from './routes/web';
import account from './routes/user';
import config from './config';
import KoaRouter from 'koa-router';
import logger from './services/logger';
import initDB from './model';

logger.info('app started');

initDB();

const app = new Koa();

function applyRouters(koaApp: Koa, ...routers: KoaRouter[]): void {
  for (const router of routers) {
    koaApp.use(router.routes());
    koaApp.use(router.allowedMethods());
  }
}

app.use(bodyParser());
app.use(tokenValidate());
applyRouters(
  app,
  gitlabRouter(),
  userRouter(),
  signKeyRouter(),
  web(),
  account()
);
app.use(output());

app.listen(config.port);
