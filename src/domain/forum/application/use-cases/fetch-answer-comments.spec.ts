import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { makeStudent } from 'test/factories/make-student';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { describe, expect, test } from 'vitest';
import { FetAnswerCommentUseCase } from './fetch-answer-comments';

describe('Fetch Answer Comments Use Case', () => {
  test('should be able to fetch answer comments', async () => {
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryAnswerCommentsRepository =
      new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository);

    const fetAnswerAnswersUseCase = new FetAnswerCommentUseCase(
      inMemoryAnswerCommentsRepository,
    );

    const student = makeStudent();
    inMemoryStudentsRepository.items.push(student);

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-id'),
      authorId: new UniqueEntityID(student.getId()),
    });
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-id'),
      authorId: new UniqueEntityID(student.getId()),
    });
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-id'),
      authorId: new UniqueEntityID(student.getId()),
    });

    await Promise.all([
      inMemoryAnswerCommentsRepository.create(comment1),
      inMemoryAnswerCommentsRepository.create(comment2),
      inMemoryAnswerCommentsRepository.create(comment3),
    ]);

    const result = await fetAnswerAnswersUseCase.execute({
      page: 1,
      answerId: 'answer-id',
    });

    expect(result.isRight()).toBe(true);
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

  test('should be able to fetch paginated answer answers', async () => {
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryAnswerCommentsRepository =
      new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository);

    const fetAnswerAnswersUseCase = new FetAnswerCommentUseCase(
      inMemoryAnswerCommentsRepository,
    );

    const student = makeStudent();
    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 25; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-id'),
          authorId: new UniqueEntityID(student.getId()),
        }),
      );
    }

    const result = await fetAnswerAnswersUseCase.execute({
      page: 2,
      answerId: 'answer-id',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(5);
  });
});
