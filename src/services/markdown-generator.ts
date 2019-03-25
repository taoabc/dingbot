import at from './at';

function makeRemindText(userName: string, mobiles: string[], preferAt = false) {
  if (preferAt && mobiles.length > 0) {
    let str = '';
    mobiles.forEach((m) => {
      str += `@${m}`;
    });
    return str;
  } else {
    return userName;
  }
}

function generateBuildEvent(data: any) {
  let status;
  if (data.build_status === 'failed') {
    status = '失败';
  } else if (data.build_status === 'success') {
    status = '成功';
  }
  const authorName = data.commit.author_name;
  const authorEmail = data.commit.author_email;
  const mobiles = at.mobilesFromAuthor(authorName, authorEmail);
  const shortSha = data.commit.sha.slice(0, 7);
  const people = makeRemindText(authorName, mobiles, data.build_status !== 'success');
  return {
    msgtype: 'markdown',
    markdown: {
      title: `构建${status}`,
      text: `## ${people} 代码在**${data.build_stage}**阶段${status}\n` +
            `> 分支：${data.ref}\n\n` +
            `> 最后提交信息：${data.commit.message}\n\n` +
            `> hash:[${shortSha}](${data.repository.homepage}/commit/${data.commit.sha})`,
    },
    at: {
      atMobiles: mobiles,
      isAtAll: false,
    },
  };
}

function generateMergeRequestEvent(data: any) {
  const userName = data.assignee.username;
  const mobiles = at.mobilesFromUser(userName, null);
  const remind = makeRemindText(userName, mobiles, true);
  return {
    msgtype: 'markdown',
    markdown: {
      title: `合并请求`,
      text: `## ${remind}，${data.user.username}请求分支合入${data.object_attributes.target_branch}\n` +
            `> 源分支：${data.object_attributes.source_branch}\n\n` +
            `> 合并信息(点击查看)：[${data.object_attributes.title}](${data.object_attributes.url})\n\n` +
            `> 最后提交信息：${data.object_attributes.last_commit.message}`,
    },
    at: {
      atMobiles: mobiles,
      isAtAll: false,
    },
  };
}

function generatePipelineEvent(data: any) {
  const success = data.object_attributes.status === 'success';
  const status = success ? '成功' : '失败';
  const authorName = data.commit.author.name;
  const authorEmail = data.commit.author.email;
  let mobiles = at.mobilesFromAuthor(authorName, authorEmail);
  // TODO 这里不稳定，成功的时候用的userName，失败的时候用的authorName，所以两个都取
  if (mobiles.length === 0) {
    mobiles = at.mobilesFromUser(authorName, authorEmail);
  }
  const shortSha = data.object_attributes.sha.slice(0, 7);
  const people = makeRemindText(authorName, mobiles, !success);
  return {
    msgtype: 'markdown',
    markdown: {
      title: `构建${status}`,
      text: `## ${people} 代码构建 **${status}**\n` +
            `> 分支：${data.ref}\n\n` +
            `> 最后提交信息：${data.commit.message}\n\n` +
            `> 点击查看:[${shortSha}](${data.commit.url})`,
    },
    at: {
      atMobiles: mobiles,
      isAtAll: false,
    },
  };
}

export default {
  generateBuildEvent,
  generateMergeRequestEvent,
  generatePipelineEvent,
};
