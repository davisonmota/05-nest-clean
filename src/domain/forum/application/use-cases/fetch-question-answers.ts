import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';

type Input = {
  questionId: string;
  page: number;
};

type Output = Either<
  null,
  {
    answers: Answer[];
  }
>;

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private readonly answerRepository: AnswersRepository) {}

  async execute({ questionId, page }: Input): Promise<Output> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    );

    return right({
      answers,
    });
  }
}
