import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { describe, expect, test } from 'vitest';
import { EditQuestionUseCase } from './edit-question';

describe('Edit Question Use Case', () => {
  test('deve editar uma dúvida (question)', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryRepositoryQuestions = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    const editQuestion = new EditQuestionUseCase(
      inMemoryRepositoryQuestions,
      inMemoryQuestionAttachmentsRepository,
    );

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('user-id'),
      },
      new UniqueEntityID('id-question'),
    );

    await inMemoryRepositoryQuestions.create(newQuestion);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: new UniqueEntityID(newQuestion.getId()),
        attachmentId: new UniqueEntityID('1'),
      }),
    );

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: new UniqueEntityID(newQuestion.getId()),
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    await editQuestion.execute({
      userId: 'user-id',
      questionId: 'id-question',
      title: 'New title edited',
      content: 'New content edited',
      attachmentsIds: ['1', '3'],
    });

    const questionEdited =
      await inMemoryRepositoryQuestions.findById('id-question');

    expect(questionEdited?.getTitle()).toBe('New title edited');
    expect(questionEdited?.getContent()).toBe('New content edited');
    expect(questionEdited?.getAuthorId()).toBe('user-id');
    expect(questionEdited?.getId()).toBe('id-question');

    expect(
      inMemoryRepositoryQuestions.items[0]
        .getAttachments()
        .getItems()[0]
        .getAttachmentId(),
    ).toBe('1');
    expect(
      inMemoryRepositoryQuestions.items[0]
        .getAttachments()
        .getItems()[1]
        .getAttachmentId(),
    ).toBe('3');
  });

  test('Não deve editar uma dúvida (question) se não for o autor', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryRepositoryQuestions = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    const editQuestion = new EditQuestionUseCase(
      inMemoryRepositoryQuestions,
      inMemoryQuestionAttachmentsRepository,
    );

    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('id-question'),
    );

    await inMemoryRepositoryQuestions.create(newQuestion);

    const result = await editQuestion.execute({
      userId: 'any-user-id',
      questionId: 'id-question',
      title: 'New title edited',
      content: 'New content edited',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
