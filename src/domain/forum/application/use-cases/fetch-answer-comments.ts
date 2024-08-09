import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

type Input = {
  answerId: string;
  page: number;
};

type Output = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

@Injectable()
export class FetAnswerCommentUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({ answerId, page }: Input): Promise<Output> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({
      answerComments,
    });
  }
}
