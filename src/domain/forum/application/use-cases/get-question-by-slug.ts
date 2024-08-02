import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { QuestionsRepository } from '../repositories/questions-repository';

type Input = {
  slug: string;
};

type Output = Either<
  ResourceNotFoundError,
  {
    question: {
      id: string;
      title: string;
      slug: string;
      content: string;
      authorId: string;
      createdAt: Date;
    };
  }
>;

export class GetQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ slug }: Input): Promise<Output> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({
      question: {
        id: question.getId(),
        authorId: question.getAuthorId(),
        title: question.getTitle(),
        content: question.getContent(),
        slug: question.getSlug(),
        createdAt: question.getCreatedAt(),
      },
    });
  }
}
