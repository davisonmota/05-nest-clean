import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from '@/infra/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from '@/infra/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { describe, expect, test } from 'vitest';
import { FetQuestionAnswersUseCase } from './fetch-question-answers';

describe('Fetch Question Answers Use Case', () => {
  test('should be able to fetch question answers', async () => {
    const answerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    const inMemoryAnswersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    );
    const fetQuestionAnswersUseCase = new FetQuestionAnswersUseCase(
      inMemoryAnswersRepository,
    );

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-id'),
      }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-id'),
      }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-id'),
      }),
    );

    const result = await fetQuestionAnswersUseCase.execute({
      page: 1,
      questionId: 'question-id',
    });

    expect(result.value?.answers).toEqual([
      expect.objectContaining({
        questionId: 'question-id',
      }),
      expect.objectContaining({
        questionId: 'question-id',
      }),
      expect.objectContaining({
        questionId: 'question-id',
      }),
    ]);
    expect(result.value?.answers).toHaveLength(3);
  });

  test('should be able to fetch paginated question answers', async () => {
    const answerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    const inMemoryAnswersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    );
    const fetQuestionAnswersUseCase = new FetQuestionAnswersUseCase(
      inMemoryAnswersRepository,
    );

    for (let i = 1; i <= 25; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-id'),
        }),
      );
    }

    const result = await fetQuestionAnswersUseCase.execute({
      page: 2,
      questionId: 'question-id',
    });
    expect(result.value?.answers).toHaveLength(5);
  });
});
