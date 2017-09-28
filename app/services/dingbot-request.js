const rp = require('request-promise-native')

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
  })
}

module.exports = doRequest
