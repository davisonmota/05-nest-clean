import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaQuestionAttachmentMapper {
  static toDomain(
    questionAttachmentData: PrismaAttachment,
  ): QuestionAttachment {
    if (!questionAttachmentData.questionId) {
      throw new Error('Invalid attachment type.');
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(questionAttachmentData.id),
        questionId: new UniqueEntityID(questionAttachmentData.questionId),
      },
      new UniqueEntityID(questionAttachmentData.id),
    );
  }
  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => attachment.getId());
    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        questionId: attachmentIds[0],
      },
    };
  }
}
