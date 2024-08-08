import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { describe, expect, test } from 'vitest';
import { FetQuestionCommentUseCase } from './fetch-question-comments';

describe('Fetch Question Comments Use Case', () => {
  test('should be able to fetch question comments', async () => {
    const inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    const FetchQuestionAnswersUseCase = new FetQuestionCommentUseCase(
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

    const result = await FetchQuestionAnswersUseCase.execute({
      page: 1,
      questionId: 'question-id',
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  test('should be able to fetch paginated question answers', async () => {
    const inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    const FetchQuestionAnswersUseCase = new FetQuestionCommentUseCase(
      inMemoryQuestionCommentsRepository,
    );
    for (let i = 1; i <= 25; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-id'),
        }),
      );
    }

    const result = await FetchQuestionAnswersUseCase.execute({
      page: 2,
      questionId: 'question-id',
    });
    expect(result.value?.questionComments).toHaveLength(5);
  });
});
