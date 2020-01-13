import { getRealName, getPhone } from '../model';
import * as GitlabType from 'src/types/gitlab';

function makeRemindText(
  realName: string,
  mobiles: string[],
  preferAt = false
): string {
  if (preferAt && mobiles.length > 0) {
    let str = '';
    mobiles.forEach(m => {
      str += `@${m}`;
    });
    return str;
  } else {
    return realName;
  }
}

async function generateBuildEvent(
  data: GitlabType.BuildEvent
): Promise<object> {
  let status;
  if (data.build_status === 'failed') {
    status = '失败';
  } else if (data.build_status === 'success') {
    status = '成功';
  }
  const authorName = data.commit.author_name;
  const authorEmail = data.commit.author_email;
  const shortSha = data.commit.sha.slice(0, 7);
  const [mobile, realName] = await Promise.all<string | null, string>([
    getPhone(authorName, authorEmail),
    getRealName(authorName, authorEmail)
  ]);
  const mobiles = mobile ? [mobile] : [];
  const people = makeRemindText(
    realName,
    mobiles,
    data.build_status !== 'success'
  );
  return {
    msgtype: 'markdown',
    markdown: {
      title: `构建${status}`,
      text:
        `## ${people} 代码在**${data.build_stage}**阶段${status}\n` +
        `> 分支：${data.ref}\n\n` +
        `> 最后提交信息：${data.commit.message}\n\n` +
        `> hash:[${shortSha}](${data.repository.homepage}/commit/${data.commit.sha})`
    },
    at: {
      atMobiles: mobiles,
      isAtAll: false
    }
  };
}

async function generateMergeRequestOpenEvent(
  data: GitlabType.MergeRequestEvent
): Promise<object> {
  const userName = data.assignee.username;
  const mobile = await getPhone(userName);
  const mobiles = mobile ? [mobile] : [];
  const userRealName = await getRealName(userName);
  const remind = makeRemindText(userRealName, mobiles, true);
  const opRealName = await getRealName(data.user.username);
  return {
    msgtype: 'markdown',
    markdown: {
      title: `合并请求`,
      text:
        `## ${remind}，${opRealName} 请求分支合入${data.object_attributes.target_branch}\n` +
        `> 源分支：${data.object_attributes.source_branch}\n\n` +
        `> 合并信息(点击查看)：[${data.object_attributes.title}](${data.object_attributes.url})\n\n` +
        `> 最后提交信息：${data.object_attributes.last_commit.message}`
    },
    at: {
      atMobiles: mobiles,
      isAtAll: false
    }
  };
}

async function generateMergeRequestClosedEvent(
  data: GitlabType.MergeRequestCloseEvent
): Promise<object> {
  const atName = data.object_attributes.last_commit.author.name;
  const atEmail = data.object_attributes.last_commit.author.email;
  const mobile = await getPhone(atName, atEmail);
  const mobiles = mobile ? [mobile] : [];
  const [atRealName, opRealName] = await Promise.all<string, string>([
    getRealName(atName, atEmail),
    getRealName(data.user.username)
  ]);
  const remind = makeRemindText(atRealName, mobiles, true);
  return {
    msgtype: 'markdown',
    markdown: {
      title: `合并关闭`,
      text:
        `## ${remind}，${opRealName} 关闭了你的合并请求\n` +
        `> 源分支：${data.object_attributes.source_branch}\n\n` +
        `> 合入分支：${data.object_attributes.target_branch}\n` +
        `> 合并信息(点击查看)：[${data.object_attributes.title}](${data.object_attributes.url})\n\n` +
        `> 最后提交信息：${data.object_attributes.last_commit.message}`
    },
    at: {
      atMobiles: mobiles,
      isAtAll: false
    }
  };
}

async function generatePipelineEvent(
  data: GitlabType.PipelineEvent
): Promise<object> {
  const success = data.object_attributes.status === 'success';
  const status = success ? '成功' : '失败';
  const authorName = data.commit.author.name;
  const authorEmail = data.commit.author.email;
  const mobile = at.getMobile(authorName, authorEmail);
  const mobiles = mobile ? [mobile] : [];
  const shortSha = data.object_attributes.sha.slice(0, 7);
  const realName = at.tryGetRealName(authorName);
  const people = makeRemindText(realName, mobiles, !success);
  return {
    msgtype: 'markdown',
    markdown: {
      title: `构建${status}`,
      text:
        `## ${people} 代码构建 **${status}**\n` +
        `> 分支：${data.object_attributes.ref}\n\n` +
        `> 最后提交信息：${data.commit.message}\n\n` +
        `> 点击查看:[${shortSha}](${data.commit.url})`
    },
    at: {
      atMobiles: mobiles,
      isAtAll: false
    }
  };
}

export default {
  generateBuildEvent,
  generateMergeRequestOpenEvent,
  generateMergeRequestClosedEvent,
  generatePipelineEvent
};
