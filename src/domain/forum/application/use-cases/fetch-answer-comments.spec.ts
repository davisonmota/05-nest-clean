import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerCommentsRepository } from '@/infra/repositories/in-memory-answer-comments-repository';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { describe, expect, test } from 'vitest';
import { FetAnswerCommentUseCase } from './fetch-answer-comments';

describe('Fetch Answer Comments Use Case', () => {
  test('should be able to fetch answer comments', async () => {
    const inMemoryAnswerCommentsRepository =
      new InMemoryAnswerCommentsRepository();
    const fetAnswerAnswersUseCase = new FetAnswerCommentUseCase(
      inMemoryAnswerCommentsRepository,
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-id'),
      }),
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-id'),
      }),
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-id'),
      }),
    );

    const result = await fetAnswerAnswersUseCase.execute({
      page: 1,
      answerId: 'answer-id',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answerComments).toHaveLength(3);
  });

  test('should be able to fetch paginated answer answers', async () => {
    const inMemoryAnswerCommentsRepository =
      new InMemoryAnswerCommentsRepository();
    const fetAnswerAnswersUseCase = new FetAnswerCommentUseCase(
      inMemoryAnswerCommentsRepository,
    );
    for (let i = 1; i <= 25; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-id'),
        }),
      );
    }

    const result = await fetAnswerAnswersUseCase.execute({
      page: 2,
      answerId: 'answer-id',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answerComments).toHaveLength(5);
  });
});
