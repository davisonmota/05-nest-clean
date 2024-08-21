import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

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

  static toDomain(attachmentData: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        url: attachmentData.url,
        title: attachmentData.title,
      },
      new UniqueEntityID(attachmentData.id),
    );
  }
}
