import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader';
import { randomUUID } from 'crypto';

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public readonly uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = `${fileName}-${randomUUID()}`;
    this.uploads.push({
      fileName,
      url,
    });
    return { url };
  }
}
