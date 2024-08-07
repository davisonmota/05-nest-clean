import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Attachment as PrismaAttachment } from '@prisma/client';

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
}
