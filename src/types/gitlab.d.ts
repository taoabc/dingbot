/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BuildEvent {
  object_kind: string; // 'build';
  ref: string; // 'gitlab-script-trigger';
  tag: boolean; // false;
  before_sha: string; // '2293ada6b400935a1378653304eaf6221e0fdb8f';
  sha: string; // '2293ada6b400935a1378653304eaf6221e0fdb8f';
  build_id: number; // 1977;
  build_name: string; // 'test';
  build_stage: string; // 'test';
  build_status: string; // 'created';
  build_started_at: string | null;
  build_finished_at: string | null;
  build_duration: number | null; // null;
  build_allow_failure: false;
  build_failure_reason: string; // 'script_failure';
  project_id: number; // 380;
  project_name: string; // 'gitlab-org/gitlab-test';
  user: {
    id: number; // 3;
    name: string; // 'User';
    email: string; // 'user@gitlab.com';
  };
  commit: {
    id: number; // 2366;
    sha: string; // '2293ada6b400935a1378653304eaf6221e0fdb8f';
    message: string; // 'test\n';
    author_name: string; // 'User';
    author_email: string; // 'user@gitlab.com';
    status: string; // 'created';
    duration: number | null;
    started_at: string | null;
    finished_at: string | null;
  };
  repository: {
    name: string; // 'gitlab_test';
    description: string; // 'Atque in sunt eos similique dolores voluptatem.';
    homepage: string; // 'http://192.168.64.1:3005/gitlab-org/gitlab-test';
    git_ssh_url: string; // 'git@192.168.64.1:gitlab-org/gitlab-test.git';
    git_http_url: string; // 'http://192.168.64.1:3005/gitlab-org/gitlab-test.git';
    visibility_level: number; // 20;
  };
}

export interface MergeRequestEvent {
  [key: string]: any;
}
export interface MergeRequestCloseEvent {
  [key: string]: any;
}
export interface PipelineEvent {
  [key: string]: any;
}

/**
 * pipeline data 11.8.0
 * {
  "object_kind": "pipeline",
  "object_attributes": {
    "id": 162,
    "ref": "ci-test",
    "tag": false,
    "sha": "87fe863df526efe4bc8e1084b3dcc7804cf1298d",
    "before_sha": null,
    "status": "failed",
    "detailed_status": "passed",
    "stages": [
      "external"
    ],
    "created_at": "2019-03-25 11:56:57 UTC",
    "finished_at": "2019-03-25 11:58:32 UTC",
    "duration": 0,
    "variables": []
  },
  "user": {
    "name": "胡海涛",
    "username": "huhaitao",
    "avatar_url": "https://secure.gravatar.com/avatar/7c552b23458fe9312cc483c67e52058c?s=80&d=identicon"
  },
  "project": {
    "id": 2990,
    "name": "blackboard",
    "description": null,
    "web_url": "https://git.100tal.com/peiyou_like_shuangshi_web/blackboard",
    "avatar_url": null,
    "git_ssh_url": "git@git.100tal.com:peiyou_like_shuangshi_web/blackboard.git",
    "git_http_url": "https://git.100tal.com/peiyou_like_shuangshi_web/blackboard.git",
    "namespace": "peiyou_like_shuangshi_web",
    "visibility_level": 0,
    "path_with_namespace": "peiyou_like_shuangshi_web/blackboard",
    "default_branch": "master",
    "ci_config_path": null
  },
  "commit": {
    "id": "87fe863df526efe4bc8e1084b3dcc7804cf1298d",
    "message": "Merge branch 'shiying_dev' into 'master'\n\nShiying dev\n\nSee merge request peiyou_like_shuangshi_web/blackboard!92",
    "timestamp": "2019-03-25T11:36:07Z",
    "url": "https://git.100tal.com/peiyou_like_shuangshi_web/blackboard/commit/87fe863df526efe4bc8e1084b3dcc7804cf1298d",
    "author": {
      "name": "zengyong",
      "email": "zengyong@100tal.com"
    }
  },
  "builds": []
}
 */
