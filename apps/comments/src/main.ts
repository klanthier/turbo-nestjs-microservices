import { NestFactory } from '@nestjs/core';
import { PrismaService } from 'nestjs-prisma';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3002);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
}

// Only disable this for our entry point -- Needed for commonjs module resolution
// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
