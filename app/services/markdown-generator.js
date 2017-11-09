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
            `> 最后提交信息：${data.commit.message}\n` +
            `> hash:[${shortSha}](${data.repository.homepage}/commit/${data.commit.sha})`
    },
    at: {
      atMobiles: mobiles,
      isAtAll: false
    }
  }
}

function generateMergeRequestEvent (data) {
  const userName = data.object_attributes.assignee.username
  const mobiles = at.mobilesFromUser(userName, null)
  return {
    msgtype: 'markdown',
    markdown: {
      title: `合并请求`,
      text: `## ${makeRemindText(userName, mobiles, true)}，${data.user.username}请求分支合入${data.object_attributes.target_branch}\n` +
            `> 源分支：${data.object_attributes.source_branch}\n\n` +
            `> 合并信息：[${data.object_attributes.title}](${data.object_attributes.url})\n\n` +
            `> 最后提交信息：${data.object_attributes.last_commit.message}`
    },
    at: {
      atMobiles: mobiles,
      isAtAll: false
    }
  }
}

module.exports = {
  generateBuildEvent,
  generateMergeRequestEvent
}
