/**
 * @remark gitlab专用
 */
import * as Koa from 'koa';
import KoaRouter, { RouterContext } from 'koa-router';
import dingbotRequest from '../services/dingbot-request';
import markdownGenerator from '../services/markdown-generator';
import logger from '../services/logger';
import { getAll, add } from '../model';

function handleBuildEvent(ctx: RouterContext): void {
  const body = ctx.request.body;
  // 中间过程不处理
  if (body.build_status === 'success' || body.build_status === 'failed') {
    dingbotRequest(
      ctx.query.dingtoken,
      markdownGenerator.generateBuildEvent(body)
    );
  }
}

function handleMergeRequestEvent(ctx: RouterContext): void {
  const body = ctx.request.body;
  // 只处理新打开
  if (
    body.object_attributes.state === 'opened' ||
    body.object_attributes.state === 'reopened'
  ) {
    dingbotRequest(
      ctx.query.dingtoken,
      markdownGenerator.generateMergeRequestOpenEvent(body)
    );
  } else if (body.object_attributes.state === 'closed') {
    dingbotRequest(
      ctx.query.dingtoken,
      markdownGenerator.generateMergeRequestClosedEvent(body)
    );
  }
}

async function handlePipelineEvent(ctx: RouterContext): Promise<void> {
  const body = ctx.request.body;
  if (
    body.object_attributes.status === 'success' ||
    body.object_attributes.status === 'failed'
  ) {
    const a = await markdownGenerator.generatePipelineEvent(body);
    dingbotRequest(
      ctx.query.dingtoken,
      // await markdownGenerator.generatePipelineEvent(body)
      a
    );
  }
}

async function userGetAll(
  ctx: Koa.Context,
  next: () => unknown
): Promise<unknown> {
  ctx.state.data = await getAll();
  return next();
}

async function importUser(
  ctx: Koa.Context,
  next: () => unknown
): Promise<unknown> {
  ctx.state.data = await add(ctx.request.body);
  return next();
}

export default function(): KoaRouter {
  const router = new KoaRouter();
  router.post('/gitlab', (ctx, next) => {
    const postbody = ctx.request.body;
    logger.info(postbody);
    switch (postbody.object_kind) {
      case 'build':
        handleBuildEvent(ctx);
        break;
      case 'merge_request':
        handleMergeRequestEvent(ctx);
        break;
      case 'pipeline':
        handlePipelineEvent(ctx);
        break;
      default:
        ctx.state.data = 'unsupport kind';
    }
    return next();
  });

  router.post('/user/getAll', userGetAll);
  router.post('/user/import', importUser);

  return router;
}
