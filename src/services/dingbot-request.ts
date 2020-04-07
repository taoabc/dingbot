import axios from 'axios';
import logger from './logger';
import crypto from 'crypto';

const DONGDONG_SEND = 'https://oapi.dingtalk.com/robot/send';

function getSign(key: string, timestamp: number): string {
  const toSign = `${timestamp}\n${key}`;
  const hmac = crypto.createHmac('sha256', key).update(toSign).digest('base64');
  return hmac;
}

const signKey =
  'SEC957586ea353032bca665961828793ebf7e9b79d34d7a466f5972ab58f2209d32';

async function doRequest(token: string, body: unknown): any {
  const timestamp = Date.now();

  const response = await axios
    .post(DONGDONG_SEND, body, {
      params: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        access_token: token,
        timestamp,
        sign: getSign(signKey, timestamp),
      },
    })
    .catch((err) => {
      logger.error(err);
    });
  return response && response.data;
}

export default doRequest;
