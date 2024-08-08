import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { AnswersRepository } from '../repositories/answers-repository';
import { Injectable } from '@nestjs/common';

type Input = {
  userId: string;
  answerId: string;
};
type Output = Either<ResourceNotFoundError | NotAllowedError, null>;

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({ answerId, userId }: Input): Promise<Output> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== answer.getAuthorId()) {
      return left(new ResourceNotFoundError());
    }

    await this.answersRepository.delete(answer);
    return right(null);
  }
}
