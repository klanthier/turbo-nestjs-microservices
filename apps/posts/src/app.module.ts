import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpCacheInterceptor } from './middleware/http-cache.interceptor';
import { PostService } from './post.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    CacheModule.register({ ttl: 0 }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PostService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule {}
