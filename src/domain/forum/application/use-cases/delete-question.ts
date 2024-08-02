import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { QuestionsRepository } from '../repositories/questions-repository';

type Input = {
  userId: string;
  questionId: string;
};

type Output = Either<ResourceNotFoundError | NotAllowedError, null>;

export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ questionId, userId }: Input): Promise<Output> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== question.getAuthorId()) {
      return left(new NotAllowedError());
    }

    await this.questionsRepository.delete(question);
    return right(null);
  }
}
