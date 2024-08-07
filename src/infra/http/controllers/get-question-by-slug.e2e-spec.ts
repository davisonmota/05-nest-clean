import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Get Question By Slug (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /question/:slugs Deve pegar um comentário de uma pergunta pelo slug', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'Dávison',
        email: 'contato@davison.com',
        password: '123',
      },
    });

    const accessToken = await jwtService.sign({ sub: user.id });

    await prismaService.question.create({
      data: {
        title: 'Question 01',
        slug: 'question-01',
        content: 'Content question 01',
        authorId: user.id,
      },
    });

    const response = await request(app.getHttpServer())
      .get('/questions/question-01')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'Question 01',
        slug: 'question-01',
      }),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
