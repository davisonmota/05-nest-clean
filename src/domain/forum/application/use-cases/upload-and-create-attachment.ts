import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Attachment } from '../../enterprise/entities/attachment';
import { AttachmentsRepository } from '../repositories/attachment-repository';
import { Uploader } from '../storage/uploader';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';

type Input = {
  fileName: string;
  fileType: string;
  body: Buffer;
};

type Output = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private readonly attachmentsRepository: AttachmentsRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({ fileName, fileType, body }: Input): Promise<Output> {
    if (!/^(image\/(jpg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);
    return right({ attachment });
  }
}
