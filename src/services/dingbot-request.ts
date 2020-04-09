import baseRequest from './base-request';

const DINGDING_SEND = 'https://oapi.dingtalk.com/robot/send';

const signKey =
  'SEC957586ea353032bca665961828793ebf7e9b79d34d7a466f5972ab58f2209d32';

function request(token: string, body: unknown): Promise<unknown> {
  return baseRequest(DINGDING_SEND, signKey, token, body);
}

export default request;
