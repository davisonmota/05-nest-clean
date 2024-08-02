import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionCommentsRepository } from '@/infra/repositories/in-memory-question-comments-repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { describe, expect, test } from 'vitest';
import { FetQuestionCommentUseCase } from './fetch-question-comments';

describe('Fetch Question Comments Use Case', () => {
  test('should be able to fetch question comments', async () => {
    const inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    const fetQuestionAnswersUseCase = new FetQuestionCommentUseCase(
      inMemoryQuestionCommentsRepository,
    );

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
      }),
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
      }),
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
      }),
    );

    const result = await fetQuestionAnswersUseCase.execute({
      page: 1,
      questionId: 'question-id',
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  test('should be able to fetch paginated question answers', async () => {
    const inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    const fetQuestionAnswersUseCase = new FetQuestionCommentUseCase(
      inMemoryQuestionCommentsRepository,
    );
    for (let i = 1; i <= 25; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-id'),
        }),
      );
    }

    const result = await fetQuestionAnswersUseCase.execute({
      page: 2,
      questionId: 'question-id',
    });
    expect(result.value?.questionComments).toHaveLength(5);
  });
});
