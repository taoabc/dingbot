const config = require('../../config')

async function tokenValidate (ctx, next) {
  if (ctx.query.token === config.token) {
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
