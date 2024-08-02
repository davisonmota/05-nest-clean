import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

type Input = {
  page: number;
};

type Output = Either<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
export class FetchRecentQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ page }: Input): Promise<Output> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    return right({ questions });
  }
}
