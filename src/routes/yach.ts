/**
 * @remark yach知音楼
 */
import KoaRouter, { RouterContext } from 'koa-router';
import yachRequest from '../services/yach-request';
import markdownGenerator from '../services/markdown-generator';
import logger from '../services/logger';

async function handleBuildEvent(ctx: RouterContext): void {
  const body = ctx.request.body;
  // 中间过程不处理
  if (body.build_status === 'success' || body.build_status === 'failed') {
    yachRequest(
      ctx.query.yachtoken,
      await markdownGenerator.generateBuildEvent(body)
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
    yachRequest(
      ctx.query.yachtoken,
      markdownGenerator.generateMergeRequestOpenEvent(body)
    );
  } else if (body.object_attributes.state === 'closed') {
    yachRequest(
      ctx.query.yachtoken,
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
    yachRequest(
      ctx.query.yachtoken,
      // await markdownGenerator.generatePipelineEvent(body)
      a
    );
  }
}

export default function (): KoaRouter {
  const router = new KoaRouter();
  router.post('/gitlab/yach', (ctx, next) => {
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

  return router;
}
