import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Slug } from '@/domain/forum/enterprise/entities/Slug';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch Question Comments (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /questions/:questionId/comments - Deve listar os comentários (comment) de um pergunta (question)', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.getId() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.getId()),
      slug: new Slug('question-01'),
    });

    await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        authorId: new UniqueEntityID(user.getId()),
        questionId: new UniqueEntityID(question.getId()),
        content: 'Comment 01',
      }),
      questionCommentFactory.makePrismaQuestionComment({
        authorId: new UniqueEntityID(user.getId()),
        questionId: new UniqueEntityID(question.getId()),
        content: 'Comment 02',
      }),
    ]);

    const questionId = question.getId();

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      questionsComments: expect.arrayContaining([
        expect.objectContaining({ content: 'Comment 01' }),
        expect.objectContaining({ content: 'Comment 02' }),
      ]),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
