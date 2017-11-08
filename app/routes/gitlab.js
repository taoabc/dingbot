/**
 * @remark gitlab专用
 */
const KoaRouter = require('koa-router')
const dingbotRequest = require('../services/dingbot-request')
const at = require('../services/at')

function handleBuildEvent (ctx) {
  const body = ctx.request.body
  let status
  if (body.build_status === 'failed') {
    status = '失败'
  } else if (body.build_status === 'success') {
    status = '成功'
  }
  if (status) {
    const shortSha = body.commit.sha.slice(0, 7)
    dingbotRequest(ctx.query.dingtoken, {
      msgtype: 'markdown',
      markdown: {
        title: `构建${status}`,
        text: `## @13333333333 ${body.commit.author_name} 提交的代码在 ${body.build_stage} 阶段构建${status}\n> 提交信息：${body.commit.message}\n> hash:[${shortSha}](${body.repository.homepage}/commit/${body.commit.sha})\n`
      },
      at: {
        atMobiles: ['13333333333'],
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
