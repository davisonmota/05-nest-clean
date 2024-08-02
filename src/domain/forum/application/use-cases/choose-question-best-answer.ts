import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { AnswersRepository } from '../repositories/answers-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

type Input = {
  userId: string;
  answerId: string;
};

type Output = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: {
      id: string;
      title: string;
      slug: string;
      content: string;
      authorId: string;
      bestAnswerId: string;
      createdAt: Date;
    };
  }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly answersRepository: AnswersRepository,
  ) {}

  async execute({ userId, answerId }: Input): Promise<Output> {
    const answer = await this.answersRepository.findById(answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionsRepository.findById(
      answer.getQuestionId(),
    );
    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.getId() !== userId) {
      return left(new NotAllowedError());
    }

    question.setBestAnswerId(new UniqueEntityID(answer.getId()));

    await this.questionsRepository.save(question);

    return right({
      question: {
        id: question.getId(),
        authorId: question.getAuthorId(),
        title: question.getTitle(),
        content: question.getContent(),
        slug: question.getSlug(),
        bestAnswerId: question.getBestAnswerId()!,
        createdAt: question.getCreatedAt(),
      },
    });
  }
}
