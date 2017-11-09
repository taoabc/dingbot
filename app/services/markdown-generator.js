const at = require('./at')

function makeRemindText (userName, mobiles, preferAt = false) {
  if (preferAt && mobiles.length > 0) {
    let str = ''
    mobiles.forEach(m => {
      str += `@${m}`
    })
    return str
  } else {
    return userName
  }
}

function generateBuildEvent (data) {
  let status
  if (data.build_status === 'failed') {
    status = '失败'
  } else if (data.build_status === 'success') {
    status = '成功'
  }
  const authorName = data.commit.author_name
  const authorEmail = data.commit.author_email
  const mobiles = at.mobilesFromAuthor(authorName, authorEmail)
  const shortSha = data.commit.sha.slice(0, 7)
  return {
    msgtype: 'markdown',
    markdown: {
      title: `构建${status}`,
      text: `## ${makeRemindText(authorName, mobiles, data.build_status !== 'success')} 代码在**${data.build_stage}**阶段${status}\n` +
            `> 分支：${data.ref}\n` +
            `> 提交信息：${data.commit.message}\n` +
            `> hash:[${shortSha}](${data.repository.homepage}/commit/${data.commit.sha})`
    },
    at: {
      atMobiles: mobiles,
      isAtAll: false
    }
  }
}

module.exports = {
  generateBuildEvent
}
