/**
 * @remark gitlab专用
 */
const KoaRouter = require('koa-router')
const dingbotRequest = require('../services/dingbot-request')
const markdownGenerator = require('../services/markdown-generator')

function handleBuildEvent (ctx) {
  const body = ctx.request.body
  dingbotRequest(ctx.query.dingtoken, markdownGenerator.generateBuildEvent(body))
}

module.exports = function () {
  const router = new KoaRouter()
  router.post('/gitlab', async (ctx, next) => {
    const postbody = ctx.request.body
    switch (postbody.object_kind) {
      case 'build':
        handleBuildEvent(ctx)
        break
      default:
        ctx.state.data = 'unsupport kind'
    }
    await next()
  })

  return router
}
