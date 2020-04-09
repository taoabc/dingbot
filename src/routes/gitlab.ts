/**
 * @remark gitlab专用
 */
import KoaRouter, { RouterContext } from 'koa-router';
import dingbotRequest from '../services/dingbot-request';
import yachRequest from '../services/yach-request';
import markdownGenerator from '../services/markdown-generator';
import logger from '../services/logger';
import { findSignKey } from '../model';

interface GitlabRequestQuery {
  token: string;
  dingtoken?: string;
  yachtoken?: string;
}

async function request(
  query: GitlabRequestQuery,
  body: object
): Promise<unknown[]> {
  const promises = [];
  if (query.dingtoken) {
    const signKey = await findSignKey(query.dingtoken);
    promises.push(dingbotRequest(query.dingtoken, signKey, body));
  }
  if (query.yachtoken) {
    const signKey = await findSignKey(query.yachtoken);
    promises.push(yachRequest(query.yachtoken, signKey, body));
  }
  return Promise.all(promises);
}

async function handleBuildEvent(ctx: RouterContext): Promise<void> {
  const body = ctx.request.body;
  // 中间过程不处理
  if (body.build_status === 'success' || body.build_status === 'failed') {
    const requestBody = await markdownGenerator.generateBuildEvent(body);
    request(ctx.query, requestBody);
  }
}

async function handleMergeRequestEvent(ctx: RouterContext): Promise<void> {
  const body = ctx.request.body;
  let requestBody;
  // 只处理新打开
  if (
    body.object_attributes.state === 'opened' ||
    body.object_attributes.state === 'reopened'
  ) {
    requestBody = await markdownGenerator.generateMergeRequestOpenEvent(body);
  } else if (body.object_attributes.state === 'closed') {
    requestBody = await markdownGenerator.generateMergeRequestClosedEvent(body);
  }
  if (requestBody) {
    request(ctx.query, requestBody);
  }
}

async function handlePipelineEvent(ctx: RouterContext): Promise<void> {
  const body = ctx.request.body;
  if (
    body.object_attributes.status === 'success' ||
    body.object_attributes.status === 'failed'
  ) {
    const requestBody = await markdownGenerator.generatePipelineEvent(body);
    request(ctx.query, requestBody);
  }
}

export default function (): KoaRouter {
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

  return router;
}
