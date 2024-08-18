import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachment';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Edit Answer (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let answerAttachmentFactory: AnswerAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwtService = moduleRef.get(JwtService);
    prismaService = moduleRef.get(PrismaService);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);

    await app.init();
  });

  test('[PUT] /answers/:id - Deve editar uma resposta (answer)', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.getId() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.getId()),
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: new UniqueEntityID(user.getId()),
      questionId: new UniqueEntityID(question.getId()),
    });

    const [attachment1, attachment2, attachment3] = await Promise.all([
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
    ]);

    await Promise.all([
      answerAttachmentFactory.makePrismaAnswerAttachment({
        attachmentId: new UniqueEntityID(attachment1.getId()),
        answerId: new UniqueEntityID(answer.getId()),
      }),
      answerAttachmentFactory.makePrismaAnswerAttachment({
        attachmentId: new UniqueEntityID(attachment2.getId()),
        answerId: new UniqueEntityID(answer.getId()),
      }),
    ]);
    const answerId = answer.getId();

    await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Edit Content answer',
        attachmentsIds: [
          attachment1.getId(),
          // attachment2.getId() => removed (edited attachments)
          attachment3.getId(),
        ],
      })
      .expect(204);

    const answerOnDatabase = await prismaService.answer.findFirst({
      where: {
        id: answerId,
        content: 'Edit Content answer',
      },
    });

    expect(answerOnDatabase).toBeTruthy();

    const attachmentOnDatabase = await prismaService.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id,
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
