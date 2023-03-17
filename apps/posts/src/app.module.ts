import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomPrismaModule } from 'nestjs-prisma';
import { RedisClientOptions } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpCacheInterceptor } from './middleware/http-cache.interceptor';
import { PostService } from './post.service';
import * as redisStore from 'cache-manager-redis-store';
import { PrismaClient } from '~prisma';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CustomPrismaModule.forRoot({
      name: 'database',
      client: new PrismaClient(),
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6379,
      },
      ttl: 0,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PostService, DatabaseService],
})
export class AppModule {}
