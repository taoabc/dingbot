const fs = require('fs')
const yaml = require('js-yaml')

function readConfig (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        return reject(err)
      }
      const cfg = yaml.safeLoad(data)
      resolve(cfg)
    })
  })
}

async function tokenValidate (ctx, next) {
  const cfg = await readConfig('./.config.yml')
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
