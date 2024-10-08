import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { describe, expect, test } from 'vitest';
import { DeleteQuestionUseCase } from './delete-question';

describe('Delete Question Use Case', () => {
  test('deve deletar uma dúvida (question) pelo id', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    const deleteQuestion = new DeleteQuestionUseCase(
      inMemoryQuestionsRepository,
    );

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('user-id'),
      },
      new UniqueEntityID('id-question'),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    await deleteQuestion.execute({
      userId: 'user-id',
      questionId: 'id-question',
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
  });

  test('Não deve deletar uma dúvida (question) se não for o autor', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    const deleteQuestion = new DeleteQuestionUseCase(
      inMemoryQuestionsRepository,
    );

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('id-question'),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await deleteQuestion.execute({
      userId: 'any-user-id',
      questionId: 'id-question',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
