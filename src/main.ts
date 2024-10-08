import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './infra/app.module';
import { Env } from './infra/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.get<number>('PORT');

  await app.listen(port);
}
bootstrap();
