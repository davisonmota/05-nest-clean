import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Slug } from '@/domain/forum/enterprise/entities/value-object/Slug';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { StudentFactory } from 'test/factories/make-student';

describe('Get Question By Slug (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /question/:slugs - Deve pegar um comentário de uma pergunta pelo slug', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'Davison',
    });

    const accessToken = jwtService.sign({ sub: user.getId() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.getId()),
      slug: new Slug('question-01'),
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      url: 'attachment-url',
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: new UniqueEntityID(attachment.getId()),
      questionId: new UniqueEntityID(question.getId()),
    });

    const response = await request(app.getHttpServer())
      .get(`/questions/question-01`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      question: expect.objectContaining({
        slug: 'question-01',
        author: 'Davison',
        attachments: [
          expect.objectContaining({
            url: 'attachment-url',
          }),
        ],
      }),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
