import axios from 'axios';
import logger from './logger';
import crypto from 'crypto';

const SEND_URL = 'https://yach-oapi.zhiyinlou.com/robot/send';

function getSign(key: string, timestamp: number): string {
  const toSign = `${timestamp}\n${key}`;
  const hmac = crypto.createHmac('sha256', key).update(toSign).digest('base64');
  return hmac;
}

const signKey = 'SEC454a5d197f5b9561dd9e82cf8a65a144';

async function doRequest(token: string, body: unknown): any {
  const timestamp = Date.now();

  const response = await axios
    .post(SEND_URL, body, {
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
