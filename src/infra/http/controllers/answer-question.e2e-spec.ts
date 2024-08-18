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
import { StudentFactory } from 'test/factories/make-student';

describe('Answer Question (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    jwtService = moduleRef.get(JwtService);
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /questions/:questionId/answers - Deve criar uma resposta (answer) para uma pergunta (question)', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.getId() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.getId()),
    });

    const [attachment1, attachment2] = await Promise.all([
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
    ]);

    const questionId = question.getId();

    await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Answer question response',
        attachmentsIds: [attachment1.getId(), attachment2.getId()],
      })
      .expect(201);

    const answerOnDatabase = await prismaService.answer.findFirst({
      where: {
        questionId,
        content: 'Answer question response',
      },
    });

    expect(answerOnDatabase).toBeTruthy();

    const attachmentOnDatabase = await prismaService.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id,
      },
    });

    expect(attachmentOnDatabase).toHaveLength(2);
  });
});
