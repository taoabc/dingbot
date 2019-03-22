import rp from 'request-promise-native';
import logger from './logger';

function doRequest(token: string, body: any) {
  const opts = {
    method: 'POST',
    uri: 'https://oapi.dingtalk.com/robot/send',
    json: true,
    qs: { access_token: token },
    body,
  };
  rp(opts).then((str) => {
    // console.log(str);
  }).catch((err) => {
    logger.error(err);
  });
}

export default doRequest;
