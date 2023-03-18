import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomPrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpCacheInterceptor } from './middleware/http-cache.interceptor';
import { PostService } from './post.service';

import { PrismaClient } from '~prisma';
import { DatabaseService } from './database.service';

import { CacheModule } from './cache.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: [
        {
          namespace: 'service-cache',
          host: 'localhost',
          port: 6379,
        },
        {
          namespace: 'reverse-client-key-map',
          host: 'localhost',
          port: 6380,
        },
      ],
    }),

    ConfigModule.forRoot(),
    CustomPrismaModule.forRoot({
      name: 'database',
      client: new PrismaClient({ log: ['query'] }),
    }),
    CacheModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PostService,
    DatabaseService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule {}
