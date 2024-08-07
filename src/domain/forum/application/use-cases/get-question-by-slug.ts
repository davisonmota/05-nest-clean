import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

type Input = {
  slug: string;
};

type Output = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ slug }: Input): Promise<Output> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
