import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/Slug';
import { Question as PrismaQuestion } from '@prisma/client';

export class PrismaQuestionMapper {
  static toDomain(questionData: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityID(questionData.authorId),
        title: questionData.title,
        content: questionData.content,
        slug: new Slug(questionData.slug),
        bestAnswerId: questionData.bestAnswerId
          ? new UniqueEntityID(questionData.bestAnswerId)
          : undefined,
        createdAt: questionData.createdAt,
        updatedAt: questionData.createdAt ?? undefined,
      },
      new UniqueEntityID(questionData.id),
    );
  }
}
