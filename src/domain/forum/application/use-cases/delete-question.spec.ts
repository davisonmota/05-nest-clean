import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { InMemoryQuestionAttachmentsRepository } from '@/infra/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from '@/infra/repositories/in-memory-question-repository';
import { makeQuestion } from 'test/factories/make-question';
import { describe, expect, test } from 'vitest';
import { DeleteQuestionUseCase } from './delete-question';

describe('Delete Question Use Case', () => {
  test('deve deletar uma dúvida (question) pelo id', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryRepositoryQuestions = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    const deleteQuestion = new DeleteQuestionUseCase(
      inMemoryRepositoryQuestions,
    );

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('user-id'),
      },
      new UniqueEntityID('id-question'),
    );

    await inMemoryRepositoryQuestions.create(newQuestion);

    await deleteQuestion.execute({
      userId: 'user-id',
      questionId: 'id-question',
    });

    expect(inMemoryRepositoryQuestions.items).toHaveLength(0);
  });

  test('Não deve deletar uma dúvida (question) se não for o autor', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryRepositoryQuestions = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    const deleteQuestion = new DeleteQuestionUseCase(
      inMemoryRepositoryQuestions,
    );

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('id-question'),
    );

    await inMemoryRepositoryQuestions.create(newQuestion);

    const result = await deleteQuestion.execute({
      userId: 'any-user-id',
      questionId: 'id-question',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
