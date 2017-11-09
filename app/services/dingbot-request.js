const rp = require('request-promise-native')
const logger = require('./logger')

function doRequest (token, body) {
  const opts = {
    method: 'POST',
    uri: 'https://oapi.dingtalk.com/robot/send',
    json: true,
    qs: { access_token: token },
    body
  }
  rp(opts).then(str => {
    console.log(str)
  }).catch(err => {
    logger.error(err)
  })
}

module.exports = doRequest
