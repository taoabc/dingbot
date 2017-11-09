/**
 * @remark gitlab专用
 */
const KoaRouter = require('koa-router')
const dingbotRequest = require('../services/dingbot-request')
const markdownGenerator = require('../services/markdown-generator')
const logger = require('../services/logger')

function handleBuildEvent (ctx) {
  const body = ctx.request.body
  // 中间过程不处理
  if (body.build_status === 'success' || body.build_status === 'failed') {
    dingbotRequest(ctx.query.dingtoken, markdownGenerator.generateBuildEvent(body))
  }
}

function handleMergeRequestEvent (ctx) {
  const body = ctx.request.body
  dingbotRequest(ctx.query.dingtoken, markdownGenerator.generateMergeRequestEvent(body))
}

module.exports = function () {
  const router = new KoaRouter()
  router.post('/gitlab', async (ctx, next) => {
    const postbody = ctx.request.body
    logger.info(postbody)
    switch (postbody.object_kind) {
      case 'build':
        handleBuildEvent(ctx)
        break
      case 'merge_request':
        handleMergeRequestEvent(ctx)
        break
      default:
        ctx.state.data = 'unsupport kind'
    }
    await next()
  })

  return router
}
