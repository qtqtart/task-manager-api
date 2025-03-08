import { AppModule } from '@app/app.module';
import { EnvironmentService } from '@app/environment/environment.service';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

(async () => {
  const application = await NestFactory.create(AppModule);
  const environmentService = application.get(EnvironmentService);

  application.setGlobalPrefix('api');

  application.useGlobalInterceptors();
  application.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  application.enableCors({
    credentials: true,
    origin: environmentService.get('ALLOWED_ORIGIN'),
  });

  await application.listen(environmentService.get('APPLICATION_PORT'));
})();
