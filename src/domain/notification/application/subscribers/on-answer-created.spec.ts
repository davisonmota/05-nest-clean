import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { waitFor } from 'test/utils/await-for';
import { describe, expect, it, vi } from 'vitest';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { OnAnswerCreated } from './on-answer-created';

describe('On Answer Created', () => {
  it('should send a notification when an answer is created', async () => {
    const answerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    const questionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    );
    const notificationsRepository = new InMemoryNotificationsRepository();
    const sendNotification = new SendNotificationUseCase(
      notificationsRepository,
    );

    const inMemoryAnswersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    );

    const sendNotificationSpy = vi.spyOn(sendNotification, 'execute');

    // eslint-disable-next-line no-new
    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotification);

    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: new UniqueEntityID(question.getId()),
    });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled();
    });
  });
});
