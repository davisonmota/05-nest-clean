import { InMemoryQuestionAttachmentsRepository } from '@/infra/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from '@/infra/repositories/in-memory-question-repository';
import { makeQuestion } from 'test/factories/make-question';
import { describe, expect, test } from 'vitest';
import { FetRecentQuestionUseCase } from './fetch-recent-questions';

describe('Fetch Recente Question Use Case', () => {
  test('should be able to fetch recent questions', async () => {
    const questionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryRepositoryQuestions = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    );
    const fetchRecentQuestionsUseCase = new FetRecentQuestionUseCase(
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

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date('2024-07-23T00:00:00') }),
      expect.objectContaining({ createdAt: new Date('2024-07-20T00:00:00') }),
      expect.objectContaining({ createdAt: new Date('2024-07-18T00:00:00') }),
    ]);
  });

  test('should be able to fetch paginated recent questions', async () => {
    const questionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryRepositoryQuestions = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    );
    const fetchRecentQuestionsUseCase = new FetRecentQuestionUseCase(
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
