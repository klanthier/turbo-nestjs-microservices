/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import {
  Injectable,
  CacheInterceptor,
  ExecutionContext,
  CACHE_KEY_METADATA,
} from '@nestjs/common';
import { getKeysFromRequest } from 'src/guards/client-key.decorator';
import { MD5 } from 'object-hash';
import { InjectRedis } from '@liaoliaots/nestjs-redis/dist/redis/common';
import Redis from 'ioredis';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  constructor(
    cacheManager: any,
    reflector: any,
    @InjectRedis('reverse-client-key-map')
    private readonly reverseClientKeyMap: Redis,
    @InjectRedis('service-cache')
    private readonly serviceCache: Redis,
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    // if there is no request, the incoming request is graphql, therefore bypass response caching.
    // later we can get the type of request (query/mutation) and if query get its field name, and attributes and cache accordingly. Otherwise, clear the cache in case of the request type is mutation.
    if (!request) {
      return undefined;
    }

    // Pattern {route}:{hashed client key}:{hashed search parameters (optional)}
    // Example /post:81234asbdsa:8709dfgsd

    const { httpAdapter } = this.httpAdapterHost;
    const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
    const clientKeys = getKeysFromRequest(request);
    const routePrefix = httpAdapter.getRequestUrl(request).split('?')[0];
    const routeParameters = httpAdapter.getRequestUrl(request).split('?')[1];
    const hashedClientKeys = MD5(clientKeys);
    const cachingKey = `${routePrefix}:${hashedClientKeys}${
      routeParameters ? `:${MD5(routeParameters)}` : ''
    }`;
    const joinedKeys = clientKeys.map((x) => `{${x}}`).join(',');
    const cacheMetadata = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (!isHttpApp || cacheMetadata) {
      return cacheMetadata;
    }

    // If we do not have a get request, we want to invalidate all resources that will match our
    // Routeprefix (AND) including all matching joined keys reversed hashes
    // this will take care of trickling-up effects from different viewpoints
    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    if (!isGetRequest) {
      setTimeout(async () => {
        this.scanAndInvalidateByClientKey(routePrefix, joinedKeys);
      }, 0);
    }

    // Verify if the existing joined key exists in our reverse map
    // We need it to further invalidate it if it did not exist
    this.reverseClientKeyMap
      .get(joinedKeys)
      .then((keys) => {
        if (!keys) {
          this.reverseClientKeyMap.set(joinedKeys, hashedClientKeys);
        }
        return undefined;
      })
      .catch(() => {
        console.log('opops');
      });

    return cachingKey;
  }
  private deleteServiceKeysByPattern(pattern: string) {
    const stream = this.serviceCache.scanStream({
      match: pattern,
    });

    stream.on('data', (keys) => {
      // `keys` is an array of strings representing key names
      if (keys.length > 0) {
        const pipeline = this.serviceCache.pipeline();
        keys.forEach((key: string) => {
          pipeline.del(key);
        });
        pipeline.exec();
      }
    });
    stream.on('end', function () {
      console.log('finished deleting');
    });
  }

  private scanAndInvalidateByClientKey(routePrefix: string, key: string) {
    const stream = this.reverseClientKeyMap.scanStream({
      match: `*${key}*`,
    });

    stream.on('data', (keys: string[]) => {
      if (keys.length > 0) {
        keys.forEach((key) => {
          this.reverseClientKeyMap
            .get(key)
            .then((reversedHash) => {
              return this.deleteServiceKeysByPattern(
                `${routePrefix}*${reversedHash}*`,
              );
            })
            .catch(() => {
              console.log('exception occured while deleting keys');
            });
        });
      }
    });
    stream.on('end', function () {
      console.log('done');
    });
  }
}
