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

describe('Delete Answer (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwtService = moduleRef.get(JwtService);
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[DELETE] /answers/:id - Deve deletar uma resposta (answer)', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.getId() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.getId()),
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: new UniqueEntityID(user.getId()),
      questionId: new UniqueEntityID(question.getId()),
    });

    const answerId = answer.getId();

    await request(app.getHttpServer())
      .delete(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(204);

    const answerOnDatabase = await prismaService.answer.findUnique({
      where: {
        id: answerId,
      },
    });

    expect(answerOnDatabase).toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
