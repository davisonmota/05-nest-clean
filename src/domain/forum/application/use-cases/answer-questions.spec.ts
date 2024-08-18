import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { describe, expect, test } from 'vitest';
import { AnswerQuestionsUseCase } from './answer-questions';

describe('Answer Question Use Case', () => {
  test('deve responder uma dúvida (question)', async () => {
    const answerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    const inMemoryRepositoryAnswers = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    );
    const answerQuestion = new AnswerQuestionsUseCase(
      inMemoryRepositoryAnswers,
    );

    const outputAnswerQuestion = await answerQuestion.execute({
      authorId: '1',
      questionId: '1',
      content: 'Nova resposta para a dúvida do aluno',
      attachmentsIds: ['1', '2'],
    });

    expect(outputAnswerQuestion.value?.content).toBe(
      'Nova resposta para a dúvida do aluno',
    );
    expect(
      inMemoryRepositoryAnswers.items[0].getAttachments().currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryRepositoryAnswers.items[0]
        .getAttachments()
        .getItems()[0]
        .getAttachmentId(),
    ).toBe('1');
    expect(
      inMemoryRepositoryAnswers.items[0]
        .getAttachments()
        .getItems()[1]
        .getAttachmentId(),
    ).toBe('2');
  });

  test('deve persistir os anexos (attachments) quando uma nova uma pergunta (answer) for criada', async () => {
    const inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    const inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    const answerQuestion = new AnswerQuestionsUseCase(
      inMemoryAnswersRepository,
    );

    const result = await answerQuestion.execute({
      authorId: '1',
      questionId: '1',
      content: 'Criando uma nova resposta (answer)',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2);
  });
});
