import axios from 'axios';
import logger from './logger';
import crypto from 'crypto';

function getSign(key: string, timestamp: number): string {
  const toSign = `${timestamp}\n${key}`;
  const hmac = crypto.createHmac('sha256', key).update(toSign).digest('base64');
  return hmac;
}

async function baseRequest(
  url: string,
  signKey: string,
  token: string,
  body: unknown
): Promise<unknown> {
  const timestamp = Date.now();

  const response = await axios
    .post(url, body, {
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

export default baseRequest;
