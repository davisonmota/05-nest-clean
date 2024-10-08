import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { describe, expect, test } from 'vitest';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';

describe('Choose Question Best Answer Use Case', () => {
  test('should be able to choose the question best answer', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    const answerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    const inMemoryAnswersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    );

    const chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    );

    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: new UniqueEntityID(question.getId()),
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await chooseQuestionBestAnswerUseCase.execute({
      userId: question.getAuthorId(),
      answerId: answer.getId(),
    });

    expect(inMemoryQuestionsRepository.items[0].getBestAnswerId()).toBe(
      answer.getId(),
    );
  });

  test('should not be able to choose another user question best answer', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    const answerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    const inMemoryAnswersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    );

    const chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    );

    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: new UniqueEntityID(question.getId()),
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    const result = await chooseQuestionBestAnswerUseCase.execute({
      userId: 'another-user-id',
      answerId: answer.getId(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
