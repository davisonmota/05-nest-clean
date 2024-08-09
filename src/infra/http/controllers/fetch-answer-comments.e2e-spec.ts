import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch Answer Comments (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let answerCommentFactory: AnswerCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /answers/:answerId/comments - Deve listar os comentários (comment) de um resposta (answer)', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.getId() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.getId()),
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: new UniqueEntityID(user.getId()),
      questionId: new UniqueEntityID(question.getId()),
    });

    await Promise.all([
      answerCommentFactory.makePrismaAnswerComment({
        authorId: new UniqueEntityID(user.getId()),
        answerId: new UniqueEntityID(answer.getId()),
        content: 'Answer Comment 01',
      }),
      answerCommentFactory.makePrismaAnswerComment({
        authorId: new UniqueEntityID(user.getId()),
        answerId: new UniqueEntityID(answer.getId()),
        content: 'Answer Comment 02',
      }),
    ]);

    const answerId = answer.getId();

    const response = await request(app.getHttpServer())
      .get(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      answersComments: expect.arrayContaining([
        expect.objectContaining({ content: 'Answer Comment 01' }),
        expect.objectContaining({ content: 'Answer Comment 02' }),
      ]),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
