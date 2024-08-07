import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Prisma, Answer as PrismaAnswer } from '@prisma/client';

export class PrismaAnswerMapper {
  static toDomain(answerData: PrismaAnswer): Answer {
    return Answer.create(
      {
        questionId: new UniqueEntityID(answerData.questionId),
        authorId: new UniqueEntityID(answerData.authorId),
        content: answerData.content,
        createdAt: answerData.createdAt,
        updatedAt: answerData.createdAt ?? undefined,
      },
      new UniqueEntityID(answerData.id),
    );
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.getId(),
      content: answer.getContent(),
      authorId: answer.getAuthorId(),
      questionId: answer.getQuestionId(),
      createdAt: answer.getCreatedAt(),
      updatedAt: answer.getUpdatedAt() ?? null,
    };
  }
}
