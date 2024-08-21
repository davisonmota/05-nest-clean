import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-object/question-details';
import {
  Attachment as PrismaAttachment,
  Question as PrismaQuestion,
  User as PrismaUser,
} from '@prisma/client';
import { PrismaAttachmentMapper } from './prisma-attachment-mapper';

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
  static toDomain(questionDetailsData: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      author: {
        id: questionDetailsData.author.id,
        name: questionDetailsData.author.name,
      },
      questionId: questionDetailsData.id,
      title: questionDetailsData.title,
      content: questionDetailsData.content,
      slug: questionDetailsData.slug,
      attachments: questionDetailsData.attachments.map(
        PrismaAttachmentMapper.toDomain,
      ),
      bestAnswerId: questionDetailsData.bestAnswerId,
      createdAt: questionDetailsData.createdAt,
      updatedAt: questionDetailsData.updatedAt,
    });
  }
}
