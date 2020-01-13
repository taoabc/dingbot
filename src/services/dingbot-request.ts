import rp from 'request-promise-native';
import logger from './logger';
import crypto from 'crypto';

function getSign(key: string, timestamp: number): string {
  const toSign = `${timestamp}\n${key}`;
  const hmac = crypto
    .createHmac('sha256', key)
    .update(toSign)
    .digest('base64');
  return hmac;
}

const signKey =
  'SEC48d8141e955932f146c24ed66d15f2264ab2ba1b1e89c355a459f8e7bef25df5';

function doRequest(token: string, body: unknown): void {
  const timestamp = Date.now();
  const opts = {
    method: 'POST',
    uri: 'https://oapi.dingtalk.com/robot/send',
    json: true,
    qs: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: token,
      timestamp,
      sign: getSign(signKey, timestamp)
    },
    body
  };
  rp(opts)
    .then(str => {
      logger.info(str);
    })
    .catch(err => {
      logger.error(err);
    });
}

export default doRequest;
