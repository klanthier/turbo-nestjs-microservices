import { batch } from 'k6/http';
import { sleep } from 'k6';
import { Options } from 'k6/options';

export const options: Options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '10s', target: 3000 },
    { duration: '3m', target: 3000 },
    { duration: '10s', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 },
  ],
};
export default function () {
  batch([
    ['GET', `${__ENV.API_URL}/posts`],
    ['GET', `${__ENV.API_URL}/feed`],
  ]);

  sleep(1);
}
