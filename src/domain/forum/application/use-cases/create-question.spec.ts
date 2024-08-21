import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { describe, expect, test } from 'vitest';
import { CreateQuestionUseCase } from './create-question';

describe('Create Question Use Case', () => {
  test('deve responder uma dúvida (question)', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    const answerQuestion = new CreateQuestionUseCase(
      inMemoryQuestionsRepository,
    );

    const { value } = await answerQuestion.execute({
      authorId: '1',
      title: 'Nova dúvida (question)',
      content: 'Criando uma nova dúvida (question)',
      attachmentsIds: ['1', '2'],
    });

    expect(value?.question.id).toBeTruthy();
    expect(value?.question.title).toBe('Nova dúvida (question)');
    expect(value?.question.content).toBe('Criando uma nova dúvida (question)');
    expect(value?.question.slug).toBe('nova-du-vida-question');
    expect(
      inMemoryQuestionsRepository.items[0].getAttachments().currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0]
        .getAttachments()
        .getItems()[0]
        .getAttachmentId(),
    ).toBe('1');
    expect(
      inMemoryQuestionsRepository.items[0]
        .getAttachments()
        .getItems()[1]
        .getAttachmentId(),
    ).toBe('2');
  });

  test('deve persistir os anexos (attachments) quando uma nova uma dúvida (question) for criada', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    const answerQuestion = new CreateQuestionUseCase(
      inMemoryQuestionsRepository,
    );

    const result = await answerQuestion.execute({
      authorId: '1',
      title: 'Nova dúvida (question)',
      content: 'Criando uma nova dúvida (question)',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
  });
});
