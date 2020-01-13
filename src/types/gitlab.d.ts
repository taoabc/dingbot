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
