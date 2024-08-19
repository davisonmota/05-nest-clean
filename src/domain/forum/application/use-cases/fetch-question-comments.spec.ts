import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { makeStudent } from 'test/factories/make-student';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { describe, expect, test } from 'vitest';
import { FetQuestionCommentUseCase } from './fetch-question-comments';

describe('Fetch Question Comments Use Case', () => {
  test('should be able to fetch question comments', async () => {
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository);
    const FetchQuestionAnswersUseCase = new FetQuestionCommentUseCase(
      inMemoryQuestionCommentsRepository,
    );

    const student = makeStudent();
    inMemoryStudentsRepository.items.push(student);

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-id'),
      authorId: new UniqueEntityID(student.getId()),
    });
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-id'),
      authorId: new UniqueEntityID(student.getId()),
    });
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-id'),
      authorId: new UniqueEntityID(student.getId()),
    });

    await Promise.all([
      inMemoryQuestionCommentsRepository.create(comment1),
      inMemoryQuestionCommentsRepository.create(comment2),
      inMemoryQuestionCommentsRepository.create(comment3),
    ]);

    const result = await FetchQuestionAnswersUseCase.execute({
      page: 1,
      questionId: 'question-id',
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({ commentId: comment1.getId() }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ commentId: comment2.getId() }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ commentId: comment3.getId() }),
        }),
      ]),
    );
  });

  test('should be able to fetch paginated question answers', async () => {
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository);
    const fetchQuestionAnswersUseCase = new FetQuestionCommentUseCase(
      inMemoryQuestionCommentsRepository,
    );

    const student = makeStudent();
    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 25; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-id'),
          authorId: new UniqueEntityID(student.getId()),
        }),
      );
    }

    const result = await fetchQuestionAnswersUseCase.execute({
      page: 2,
      questionId: 'question-id',
    });
    expect(result.value?.comments).toHaveLength(5);
  });
});
