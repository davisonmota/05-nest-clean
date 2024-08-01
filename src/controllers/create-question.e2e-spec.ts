import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create Question (e2e)', () => {
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

  test('[POST] /questions: Deve criar uma pergunta (question)', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'Dávison',
        email: 'contato@davison.com',
        password: '123',
      },
    });

    const accessToken = await jwtService.sign({ sub: user.id });

    await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Create New Question',
        content: 'Content question',
      })
      .expect(201);

    const questionOnDatabase = await prismaService.question.findFirst({
      where: {
        title: 'Create New Question',
      },
    });

    expect(questionOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
