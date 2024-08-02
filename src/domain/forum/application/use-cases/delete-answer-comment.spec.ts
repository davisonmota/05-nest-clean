import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { InMemoryAnswerCommentsRepository } from '@/infra/repositories/in-memory-answer-comments-repository';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { describe, expect, test } from 'vitest';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';

describe('Delete Answer Comment Use Case', () => {
  test('should be able to delete a answer comment', async () => {
    const inMemoryAnswerCommentsRepository =
      new InMemoryAnswerCommentsRepository();
    const deleteAnswerCommentUseCase = new DeleteAnswerCommentUseCase(
      inMemoryAnswerCommentsRepository,
    );

    const answerComment = makeAnswerComment();
    await inMemoryAnswerCommentsRepository.create(answerComment);

    await deleteAnswerCommentUseCase.execute({
      userId: answerComment.getAuthorId(),
      answerCommentId: answerComment.getId(),
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  test('should not  be able to delete another user answer comment', async () => {
    const inMemoryAnswerCommentsRepository =
      new InMemoryAnswerCommentsRepository();
    const deleteAnswerCommentUseCase = new DeleteAnswerCommentUseCase(
      inMemoryAnswerCommentsRepository,
    );

    const answerComment = makeAnswerComment();
    await inMemoryAnswerCommentsRepository.create(answerComment);

    const result = await deleteAnswerCommentUseCase.execute({
      userId: 'another-user-id',
      answerCommentId: answerComment.getId(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
