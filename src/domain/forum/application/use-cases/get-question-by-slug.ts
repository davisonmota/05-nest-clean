import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { QuestionDetails } from '../../enterprise/entities/value-object/question-details';
import { QuestionsRepository } from '../repositories/questions-repository';

type Input = {
  slug: string;
};

type Output = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ slug }: Input): Promise<Output> {
    const question = await this.questionsRepository.findDetailsBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
