import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaAnswerAttachmentMapper {
  static toDomain(answerAttachmentData: PrismaAttachment): AnswerAttachment {
    if (!answerAttachmentData.answerId) {
      throw new Error('Invalid attachment type.');
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityID(answerAttachmentData.id),
        answerId: new UniqueEntityID(answerAttachmentData.answerId),
      },
      new UniqueEntityID(answerAttachmentData.id),
    );
  }

  static toPrismaUpdateMany(
    attachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.getAttachmentId();
    });
    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        answerId: attachments[0].getAnswerId(),
      },
    };
  }
}
