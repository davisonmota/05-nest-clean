import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { describe, expect, test } from 'vitest';
import { CommentOnQuestionUseCase } from './comment-on-question';

describe('Comment On Question Use Case', () => {
  test('should be able to comment on question', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    const inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository);

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
