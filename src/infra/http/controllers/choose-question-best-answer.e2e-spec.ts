import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Chose Question Best Answer (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwtService = moduleRef.get(JwtService);
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[PATCH] /answer/:answerId/choose-as-best - Deve definir uma resposta, para um pergunta, como a melhor', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.getId() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.getId()),
    });

    const anotherUser = await studentFactory.makePrismaStudent();
    const answer = await answerFactory.makePrismaAnswer({
      questionId: new UniqueEntityID(question.getId()),
      authorId: new UniqueEntityID(anotherUser.getId()),
    });

    const answerId = answer.getId();

    await request(app.getHttpServer())
      .patch(`/answer/${answerId}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(204);

    const questionOnDatabase = await prismaService.question.findUnique({
      where: {
        id: question.getId(),
      },
    });

    expect(questionOnDatabase?.bestAnswerId).toBe(answerId);
  });

  afterAll(async () => {
    await app.close();
  });
});
