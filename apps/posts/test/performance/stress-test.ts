import { batch } from 'k6/http';
import { sleep } from 'k6';
import { Options } from 'k6/options';

export const options: Options = {
  stages: [
    { duration: '20s', target: 100 },
    { duration: '50s', target: 100 },
    { duration: '20s', target: 300 },
    { duration: '50s', target: 300 },
    { duration: '20s', target: 500 },
    { duration: '50s', target: 500 },
    { duration: '20s', target: 700 },
    { duration: '50s', target: 700 },
    { duration: '100s', target: 0 },
  ],
};

export default function () {
  batch([
    ['GET', `${__ENV.API_URL}/posts`],
    ['GET', `${__ENV.API_URL}/feed`],
  ]);

  sleep(1);
}
