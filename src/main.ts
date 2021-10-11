import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Bootstrap IIFE
(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3000);
})();
