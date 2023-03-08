import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { PostService } from './post.service';
import { PrismaService } from './prisma.service';

describe('AppController', () => {
  let appController: AppController;
  const prismaService = { post: { findMany: () => [] } };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, PostService, PrismaService],
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello from posts');
    });
  });

  describe('GET/feed', () => {
    it('should return published post', async () => {
      const response = await appController.getPublishedPosts();
      console.log('response', response);

      expect(response).toStrictEqual([]);
    });
  });
});
