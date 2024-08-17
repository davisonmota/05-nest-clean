import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { StudentFactory } from 'test/factories/make-student';

describe('Edit Question (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let prismaService: PrismaService;
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
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[PUT] /questions/:id - Deve editar uma pergunta (question)', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.getId() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.getId()),
    });

    const [attachment1, attachment2, attachment3] = await Promise.all([
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
    ]);

    await Promise.all([
      questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: new UniqueEntityID(attachment1.getId()),
        questionId: new UniqueEntityID(question.getId()),
      }),
      questionAttachmentFactory.makePrismaQuestionAttachment({
        attachmentId: new UniqueEntityID(attachment2.getId()),
        questionId: new UniqueEntityID(question.getId()),
      }),
    ]);

    const questionId = question.getId();

    await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Edit New Question',
        content: 'Edit Content question',
        attachmentsIds: [
          attachment1.getId(),
          // attachment2.getId() => removed (edit attachments)
          attachment3.getId(),
        ],
      })
      .expect(204);

    const questionOnDatabase = await prismaService.question.findFirst({
      where: {
        id: questionId,
        title: 'Edit New Question',
        content: 'Edit Content question',
      },
    });

    expect(questionOnDatabase).toBeTruthy();

    const attachmentOnDatabase = await prismaService.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
      },
    });

    expect(attachmentOnDatabase).toHaveLength(2);
    expect(attachmentOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.getId(),
        }),
        expect.objectContaining({
          id: attachment3.getId(),
        }),
      ]),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
