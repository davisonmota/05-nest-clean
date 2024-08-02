import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { InMemoryQuestionCommentsRepository } from '@/infra/repositories/in-memory-question-comments-repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { describe, expect, test } from 'vitest';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';

describe('Delete Question Comment Use Case', () => {
  test('should be able to delete a question comment', async () => {
    const inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    const deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(
      inMemoryQuestionCommentsRepository,
    );

    const questionComment = makeQuestionComment();
    await inMemoryQuestionCommentsRepository.create(questionComment);

    await deleteQuestionCommentUseCase.execute({
      userId: questionComment.getAuthorId(),
      questionCommentId: questionComment.getId(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  test('should not  be able to delete another user question comment', async () => {
    const inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    const deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(
      inMemoryQuestionCommentsRepository,
    );

    const questionComment = makeQuestionComment();
    await inMemoryQuestionCommentsRepository.create(questionComment);

    const result = await deleteQuestionCommentUseCase.execute({
      userId: 'another-user-id',
      questionCommentId: questionComment.getId(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
