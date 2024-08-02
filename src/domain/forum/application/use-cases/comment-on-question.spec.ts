import { InMemoryQuestionAttachmentsRepository } from '@/infra/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionCommentsRepository } from '@/infra/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from '@/infra/repositories/in-memory-question-repository';
import { makeQuestion } from 'test/factories/make-question';
import { describe, expect, test } from 'vitest';
import { CommentOnQuestionUseCase } from './comment-on-question';

describe('Comment On Question Use Case', () => {
  test('should be able to comment on question', async () => {
    const questionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    );
    const inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();

    const commentOnQuestionUseCase = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );

    const question = makeQuestion();
    await inMemoryQuestionsRepository.create(question);

    await commentOnQuestionUseCase.execute({
      authorId: 'author-id',
      questionId: question.getId(),
      content: 'Comment question',
    });

    expect(inMemoryQuestionCommentsRepository.items[0].getContent()).toBe(
      'Comment question',
    );
    expect(inMemoryQuestionCommentsRepository.items[0].getId()).toBeTruthy();
  });
});
