import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from 'nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(3001);
}

// Only disable this for our entry point -- Needed for commonjs module resolution
// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
