import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { waitFor } from 'test/utils/await-for';
import { describe, expect, it, vi } from 'vitest';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { OnQuestionBestAnswerChosenEvent } from './on-question-best-answer-chosen';

describe('On Question Best Answer Chosen Event', () => {
  it('should send a notification when has question new best answer chosen', async () => {
    const answerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    const questionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const attachmentsRepository = new InMemoryAttachmentsRepository();
    const studentsRepository = new InMemoryStudentsRepository();
    const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
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
    new OnQuestionBestAnswerChosenEvent(
      inMemoryAnswersRepository,
      sendNotification,
    );

    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: new UniqueEntityID(question.getId()),
    });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    question.setBestAnswerId(new UniqueEntityID(answer.getId()));

    inMemoryQuestionsRepository.save(question);

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled();
    });
  });
});
