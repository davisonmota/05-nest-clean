import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { Env } from '../env';

@Injectable()
export class R2Storage implements Uploader {
  private readonly client: S3Client;

  constructor(private readonly configService: ConfigService<Env, true>) {
    this.client = new S3Client({
      endpoint: `https://${this.configService.get('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY_ID'),
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uniqueFileName = `${randomUUID()}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    return { url: uniqueFileName };
  }
}
