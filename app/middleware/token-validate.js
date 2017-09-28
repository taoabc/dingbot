const config = require('../services/config')
const cfg = config()

async function tokenValidate (ctx, next) {
  if (ctx.query.token === cfg.token) {
    await next()
  } else {
    ctx.body = {
      code: -1,
      msg: 'invalid token'
    }
  }
}

module.exports = function (opts) {
  return tokenValidate
}
