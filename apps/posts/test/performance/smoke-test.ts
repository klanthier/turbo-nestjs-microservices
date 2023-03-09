import { get } from 'k6/http';
import { Options } from 'k6/options';

export const options: Options = {
  vus: 1,
  duration: '10s',
};

export default () => {
  get(`${__ENV.API_URL}/feed`);
};
