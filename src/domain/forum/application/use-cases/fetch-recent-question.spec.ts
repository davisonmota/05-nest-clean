import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { describe, expect, test } from 'vitest';
import { FetchRecentQuestionUseCase } from './fetch-recent-questions';

describe('Fetch Recente Question Use Case', () => {
  test('should be able to fetch recent questions', async () => {
    const questionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryRepositoryQuestions = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    );
    const fetchRecentQuestionsUseCase = new FetchRecentQuestionUseCase(
      inMemoryRepositoryQuestions,
    );

    await inMemoryRepositoryQuestions.create(
      makeQuestion({
        createdAt: new Date('2024-07-20T00:00:00'),
      }),
    );
    await inMemoryRepositoryQuestions.create(
      makeQuestion({
        createdAt: new Date('2024-07-18T00:00:00'),
      }),
    );
    await inMemoryRepositoryQuestions.create(
      makeQuestion({
        createdAt: new Date('2024-07-23T00:00:00'),
      }),
    );

    const result = await fetchRecentQuestionsUseCase.execute({
      page: 1,
    });

    expect(result.value?.questions).toHaveLength(3);
  });

  test('should be able to fetch paginated recent questions', async () => {
    const questionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryRepositoryQuestions = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    );
    const fetchRecentQuestionsUseCase = new FetchRecentQuestionUseCase(
      inMemoryRepositoryQuestions,
    );

    for (let i = 1; i <= 25; i++) {
      await inMemoryRepositoryQuestions.create(makeQuestion());
    }

    const result = await fetchRecentQuestionsUseCase.execute({
      page: 2,
    });

    expect(result.value?.questions).toHaveLength(5);
  });
});
