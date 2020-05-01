import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import tokenValidate from './middleware/token-validate';
import output from './middleware/output';
import gitlabRouter from './routes/gitlab';
import employeeRouter from './routes/employee';
import signKeyRouter from './routes/sign-key';
import userRouter from './routes/user';
import web from './routes/web';
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

app.use(cors());
app.use(bodyParser());
app.use(tokenValidate());
applyRouters(
  app,
  gitlabRouter(),
  userRouter(),
  signKeyRouter(),
  web(),
  employeeRouter()
);
app.use(output());

app.listen(config.port);
