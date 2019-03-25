import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import tokenValidate from './middleware/token-validate';
import output from './middleware/output';
import gitlabRouter from './routes/gitlab';
import { config } from './data';
import KoaRouter from 'koa-router';

const app = new Koa();

function applyRouters(koaApp: Koa, ...routers: KoaRouter[]) {
  for (const router of routers) {
    koaApp.use(router.routes());
    koaApp.use(router.allowedMethods());
  }
}

app.use(bodyParser());
app.use(tokenValidate());
applyRouters(app, gitlabRouter());
app.use(output());

app.listen(config.port);
