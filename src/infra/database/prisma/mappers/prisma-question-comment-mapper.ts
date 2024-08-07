import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Prisma, Comment as PrismaComment } from '@prisma/client';

export class PrismaQuestionCommentMapper {
  static toDomain(questionCommentData: PrismaComment): QuestionComment {
    if (!questionCommentData.questionId) {
      throw new Error('Invalid comment type.');
    }

    return QuestionComment.create(
      {
        questionId: new UniqueEntityID(questionCommentData.questionId),
        authorId: new UniqueEntityID(questionCommentData.authorId),
        content: questionCommentData.content,
        createdAt: questionCommentData.createdAt,
        updatedAt: questionCommentData.createdAt,
      },
      new UniqueEntityID(questionCommentData.id),
    );
  }

  static toPrisma(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.getId(),
      content: questionComment.getContent(),
      authorId: questionComment.getAuthorId(),
      questionId: questionComment.getQuestionId(),
      createdAt: questionComment.getCreatedAt(),
      updatedAt: questionComment.getUpdatedAt() ?? null,
    };
  }
}
