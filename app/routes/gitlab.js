/**
 * @remark gitlab专用
 */
const KoaRouter = require('koa-router')
const dingbotRequest = require('../services/dingbot-request')

function handleBuildEvent (ctx) {
  const body = ctx.request.body
  if (body.build_status === 'failed') {
    dingbotRequest(ctx.query.dingtoken, {
      msgtype: 'markdown',
      markdown: {
        title: '构建失败',
        text: `## ${body.commit.author_name} 代码在 ${body.build_stage} 阶段构建失败\n> 提交信息：${body.commit.message}\n> hash:[${body.commit.sha}](${body.repository.homepage}/commit/${body.commit.sha})\n`
      },
      at: {
        atMobiles: [],
        isAtAll: false
      }
    })
  }
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
