import { InMemoryAnswerAttachmentsRepository } from '@/infra/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswerCommentsRepository } from '@/infra/repositories/in-memory-answer-comments-repository';
import { InMemoryAnswersRepository } from '@/infra/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { describe, expect, test } from 'vitest';
import { CommentOnAnswerUseCase } from './comment-on-answer';

describe('Comment On Answer Use Case', () => {
  test('should be able to comment on answer', async () => {
    const answerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    const inMemoryAnswersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    );
    const inMemoryAnswerCommentsRepository =
      new InMemoryAnswerCommentsRepository();

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
