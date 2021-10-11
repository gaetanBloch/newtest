import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Bootstrap IIFE
(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Newtest API')
    .setDescription(
      'REST API services to test Postman collections files / strings with Newman API and give response and report on the execution of the tests suite',
    )
    .setVersion('0.1')
    .setLicense('MIT', 'https://en.wikipedia.org/wiki/MIT_License')
    .setContact('Gaëtan Bloch', 'https://gbloch.tech', 'gaetan.bloch@gbloch.io')
    .addTag('test')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  await app.listen(3000);
})();
