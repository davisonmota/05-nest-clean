import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

type Input = {
  questionId: string;
  page: number;
};

type Output = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

@Injectable()
export class FetQuestionCommentUseCase {
  constructor(
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({ questionId, page }: Input): Promise<Output> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({
      questionComments,
    });
  }
}
