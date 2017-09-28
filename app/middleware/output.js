async function output (ctx, next) {
  ctx.body = {
    code: ctx.state.code || 0,
    msg: ctx.state.msg || 'ok',
    data: ctx.state.data
  }
  await next()
}

module.exports = function (opts) {
  return output
}
