import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAttachment } from 'test/factories/make-attachment';
import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { makeStudent } from 'test/factories/make-student';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { describe, expect, test } from 'vitest';
import { Question } from '../../enterprise/entities/question';
import { QuestionDetails } from '../../enterprise/entities/value-object/question-details';
import { Slug } from '../../enterprise/entities/value-object/Slug';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';

describe('Get Question By Slug Use Case', () => {
  test('deve responder uma dúvida (question)', async () => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    const inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    const inMemoryStudentsRepository = new InMemoryStudentsRepository();
    const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    const student = makeStudent();
    inMemoryStudentsRepository.create(student);

    const question = makeQuestion({
      slug: new Slug('example-question'),
      authorId: new UniqueEntityID(student.getId()),
    });
    inMemoryQuestionsRepository.create(question);

    const attachment = makeAttachment({
      title: 'attachment title',
    });
    inMemoryAttachmentsRepository.create(attachment);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: new UniqueEntityID(attachment.getId()),
        questionId: new UniqueEntityID(question.getId()),
      }),
    );

    const getQuestionBySlug = new GetQuestionBySlugUseCase(
      inMemoryQuestionsRepository,
    );

    inMemoryQuestionsRepository.create(
      Question.create({
        authorId: new UniqueEntityID('1'),
        title: 'Example Question',
        content: 'Content question',
      }),
    );

    const result = await getQuestionBySlug.execute({
      slug: 'example-question',
    });

    if (result.isRight()) {
      const { question } = result.value;
      expect(question).toBeInstanceOf(QuestionDetails);
    }
    expect(result.isRight()).toBe(true);
  });
});
