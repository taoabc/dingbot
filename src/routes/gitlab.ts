/**
 * @remark gitlab专用
 */
import KoaRouter, { RouterContext } from 'koa-router';
import dingbotRequest from '../services/dingbot-request';
import markdownGenerator from '../services/markdown-generator';
import logger from '../services/logger';

function handleBuildEvent(ctx: RouterContext) {
  const body = ctx.request.body;
  // 中间过程不处理
  if (body.build_status === 'success' || body.build_status === 'failed') {
    dingbotRequest(ctx.query.dingtoken, markdownGenerator.generateBuildEvent(body));
  }
}

function handleMergeRequestEvent(ctx: RouterContext) {
  const body = ctx.request.body;
  // 只处理新打开
  if (body.object_attributes.state === 'opened' || body.object_attributes.state === 'reopened') {
    dingbotRequest(ctx.query.dingtoken, markdownGenerator.generateMergeRequestEvent(body));
  }
}

function handlePipelineEvent(ctx: RouterContext) {
  const body = ctx.request.body;
  if (body.object_attributes.status === 'success' || body.object_attributes.status === 'failed') {
    dingbotRequest(ctx.query.dingtoken, markdownGenerator.generatePipelineEvent(body));
  }
}

export default function() {
  const router = new KoaRouter();
  router.post('/gitlab', async (ctx, next) => {
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
    await next();
  });

  return router;
}
