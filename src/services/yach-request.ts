import baseRequest from './base-request';

const SEND_URL = 'https://yach-oapi.zhiyinlou.com/robot/send';

function request(
  token: string,
  signKey: string,
  body: unknown
): Promise<unknown> {
  return baseRequest(SEND_URL, signKey, token, body);
}

export default request;
