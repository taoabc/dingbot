import baseRequest from './base-request';

const SEND_URL = 'https://yach-oapi.zhiyinlou.com/robot/send';

const signKey = 'SEC454a5d197f5b9561dd9e82cf8a65a144';

function request(token: string, body: unknown): Promise<unknown> {
  return baseRequest(SEND_URL, signKey, token, body);
}

export default request;
