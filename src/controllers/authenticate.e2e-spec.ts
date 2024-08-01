import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('Authenticate (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /sessions: Deve autenticar o usuário', async () => {
    await prismaService.user.create({
      data: {
        name: 'Dávison',
        email: 'contato@davison.com',
        password: await hash('123', 8),
      },
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
