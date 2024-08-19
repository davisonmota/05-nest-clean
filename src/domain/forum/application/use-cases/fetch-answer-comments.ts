import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-object/comment-with-author';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

type Input = {
  answerId: string;
  page: number;
};

type Output = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class FetAnswerCommentUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({ answerId, page }: Input): Promise<Output> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      );

    return right({
      comments,
    });
  }
}
