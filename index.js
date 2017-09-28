const Koa = require('koa')
const KoaRouter = require('koa-router')
const bodyParser = require('koa-bodyparser')
const rp = require('request-promise-native')
const tokenValidate = require('./token-validate')
const output = require('./output')

const app = new Koa()
const router = new KoaRouter()

function requestDingbot (token, body) {
  const opts = {
    method: 'POST',
    uri: 'https://oapi.dingtalk.com/robot/send',
    json: true,
    qs: { access_token: token },
    body
  }
  rp(opts).then(str => {
    console.log(str)
  })
}

function handleBuildEvent (ctx) {
  const body = ctx.request.body
  if (body.build_status === 'failed') {
    requestDingbot(ctx.query.dingtoken, {
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

router.post('/', async (ctx, next) => {
  const postbody = ctx.request.body
  switch (postbody.object_kind) {
    case 'build':
      ctx.state.body = postbody
      console.log(ctx.state.body + '\n\n')
      handleBuildEvent(ctx)
      break
    default:
      ctx.state.data = 'unsupport kind'
  }
  await next()
})

app.use(bodyParser())
app.use(tokenValidate())
app.use(router.routes())
app.use(router.allowedMethods())
app.use(output())

app.listen(8001)
