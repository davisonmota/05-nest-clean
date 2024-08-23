import { Env } from '@/infra/env';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(configService: ConfigService<Env, true>) {
    super({
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      db: configService.get('REDIS_DB'),
    });
  }

  onModuleDestroy() {
    this.disconnect();
  }
}
