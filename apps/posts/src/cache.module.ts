import {
  CACHE_MANAGER,
  CacheModule as BaseCacheModule,
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { Cache } from 'cache-manager';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    BaseCacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => {
        return {
          store: redisStore,
          socket: {
            host: 'localhost',
            port: 6379,
          },
          ttl: 0,
        };
      },
    }),
  ],
  exports: [BaseCacheModule],
})
export class CacheModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  public onModuleInit(): any {
    const logger = new Logger('Cache');

    // Commands that are interesting to log
    const commands = ['get', 'set', 'del'];
    const cache = this.cache;
    commands.forEach((commandName) => {
      const oldCommand = (cache as any)[commandName];
      (cache as any)[commandName] = async (...arguments_: any) => {
        // Computes the duration
        const start = new Date();
        const result = await oldCommand.call(cache, ...arguments_);
        const end = new Date();
        const duration = end.getTime() - start.getTime();

        // Avoid logging the options
        arguments_ = arguments_.slice(0, 2);
        logger.log(
          `${commandName.toUpperCase()} ${arguments_.join(
            ', ',
          )} - ${duration}ms`,
        );

        return result;
      };
    });
  }
}
