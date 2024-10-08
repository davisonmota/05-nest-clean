import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { describe, expect, test } from 'vitest';
import { CommentOnAnswerUseCase } from './comment-on-answer';

describe('Comment On Answer Use Case', () => {
  test('should be able to comment on answer', async () => {
    const answerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    const inMemoryAnswersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    );
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryAnswerCommentsRepository =
      new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository);

    const commentOnAnswerUseCase = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    );

    const answer = makeAnswer();
    await inMemoryAnswersRepository.create(answer);

    await commentOnAnswerUseCase.execute({
      authorId: 'author-id',
      answerId: answer.getId(),
      content: 'Comment answer',
    });

    expect(inMemoryAnswerCommentsRepository.items[0].getContent()).toBe(
      'Comment answer',
    );
    expect(inMemoryAnswerCommentsRepository.items[0].getId()).toBeTruthy();
  });
});
