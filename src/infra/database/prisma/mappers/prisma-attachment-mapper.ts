import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { Prisma } from '@prisma/client';

export class PrismaAttachmentMapper {
  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.getId(),
      title: attachment.getTitle(),
      url: attachment.getUrl(),
    };
  }
}
