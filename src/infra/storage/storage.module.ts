import { Uploader } from '@/domain/forum/application/storage/uploader';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { R2Storage } from './r2-storage';

@Module({
  imports: [ConfigService],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
