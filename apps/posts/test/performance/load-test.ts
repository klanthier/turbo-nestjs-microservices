import { get, post, put } from 'k6/http';
import { check, sleep } from 'k6';
import { Options } from 'k6/options';

export const options: Options = {
  stages: [
    { duration: '30s', target: 300 },
    { duration: '1m', target: 300 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'],
  },
};

export default () => {
  const postResponse = post(`${__ENV.API_URL}/post`, {
    title: 'post title',
    content: 'the content',
  });

  check(postResponse, {
    'created post successfully': (response) => {
      return response.status === 201;
    },
  });

  if (postResponse.body && typeof postResponse.body === 'string') {
    const result = JSON.parse(postResponse.body);
    // read the post
    const onePostResponse = get(`${__ENV.API_URL}/post/${result.id}`);

    check(onePostResponse, {
      'got post data': (response) => {
        return response.status === 200;
      },
    });

    // publish the post
    const publishPostResponse = put(`${__ENV.API_URL}/publish/${result.id}`);
    check(publishPostResponse, {
      'got published post data': (response) => {
        return response.status === 200;
      },
    });
  }
  sleep(1);
};
