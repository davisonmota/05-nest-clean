import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/Slug';
import { Prisma, Question as PrismaQuestion } from '@prisma/client';

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

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.getId(),
      title: question.getTitle(),
      content: question.getContent(),
      slug: question.getSlug(),
      authorId: question.getAuthorId(),
      bestAnswerId: question.getBestAnswerId(),
      createdAt: question.getCreatedAt(),
      updatedAt: question.getUpdatedAt(),
    };
  }
}
