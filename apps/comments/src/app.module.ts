import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentService } from './comment.service';
import { PrismaClient } from '~prisma';
import { CustomPrismaModule, PrismaService } from 'nestjs-prisma';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CustomPrismaModule.forRoot({
      name: 'PrismaServiceComment',
      client: new PrismaClient(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, CommentService, PrismaService],
})
export class AppModule {}
