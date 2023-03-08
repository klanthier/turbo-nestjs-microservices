import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
}

// Only disable this for our entry point -- Needed for commonjs module resolution
// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap();
