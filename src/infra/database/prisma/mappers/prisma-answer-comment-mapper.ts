import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { Prisma, Comment as PrismaComment } from '@prisma/client';

export class PrismaAnswerCommentMapper {
  static toDomain(answerCommentData: PrismaComment): AnswerComment {
    if (!answerCommentData.answerId) {
      throw new Error('Invalid comment type.');
    }

    return AnswerComment.create(
      {
        answerId: new UniqueEntityID(answerCommentData.answerId),
        authorId: new UniqueEntityID(answerCommentData.authorId),
        content: answerCommentData.content,
        createdAt: answerCommentData.createdAt,
        updatedAt: answerCommentData.createdAt,
      },
      new UniqueEntityID(answerCommentData.id),
    );
  }

  static toPrisma(
    answerComment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.getId(),
      content: answerComment.getContent(),
      authorId: answerComment.getAuthorId(),
      answerId: answerComment.getAnswerId(),
      createdAt: answerComment.getCreatedAt(),
      updatedAt: answerComment.getUpdatedAt() ?? null,
    };
  }
}
