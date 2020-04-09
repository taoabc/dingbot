import baseRequest from './base-request';

const DINGDING_SEND = 'https://oapi.dingtalk.com/robot/send';

function request(
  token: string,
  signKey: string,
  body: unknown
): Promise<unknown> {
  return baseRequest(DINGDING_SEND, signKey, token, body);
}

export default request;
