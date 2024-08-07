import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Authenticate (e2e)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test('[POST] /sessions: Deve autenticar o usuário', async () => {
    await studentFactory.makePrismaStudent({
      email: 'contato@davison.com',
      password: await hash('123', 8),
    });

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'contato@davison.com',
        password: '123',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
