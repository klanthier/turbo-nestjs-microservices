import { batch } from 'k6/http';
import { sleep } from 'k6';
import { Options } from 'k6/options';

export const options: Options = {
  stages: [
    { duration: '20s', target: 35 },
    { duration: '50s', target: 35 },
    { duration: '20s', target: 100 },
    { duration: '50s', target: 100 },
    { duration: '20s', target: 200 },
    { duration: '50s', target: 200 },
    { duration: '20s', target: 250 },
    { duration: '50s', target: 250 },
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
