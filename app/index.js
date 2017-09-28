const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const tokenValidate = require('./middleware/token-validate')
const output = require('./middleware/output')
const gitlabRouter = require('./routes/gitlab')
const config = require('./services/config')

const app = new Koa()

function applyRouters (app, ...routers) {
  for (const router of routers) {
    console.log(router)
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}
console.log(gitlabRouter())

app.use(bodyParser())
app.use(tokenValidate())
applyRouters(app, gitlabRouter())
app.use(output())

app.listen(config().port)
