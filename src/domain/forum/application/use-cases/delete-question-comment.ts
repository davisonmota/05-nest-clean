import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

type Input = {
  userId: string;
  questionCommentId: string;
};

type Output = Either<ResourceNotFoundError | NotAllowedError, null>;

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({ userId, questionCommentId }: Input): Promise<Output> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId);
    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }

    if (questionComment.getAuthorId() !== userId) {
      return left(new NotAllowedError());
    }

    await this.questionCommentsRepository.delete(questionComment);
    return right(null);
  }
}
