import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachment-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { Injectable } from '@nestjs/common';
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const attachmentData = PrismaAttachmentMapper.toPrisma(attachment);
    await this.prismaService.attachment.create({
      data: attachmentData,
    });
  }
}
