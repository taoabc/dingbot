const Koa = require('koa')
const KoaRouter = require('koa-router')
const app = new Koa()
const router = new KoaRouter()

router.get('/', (ctx, next) => {
  ctx.body = 'Hello router'
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8001)