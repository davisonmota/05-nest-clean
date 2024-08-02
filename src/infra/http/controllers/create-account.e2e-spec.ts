import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create Account (e2e)', () => {
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

  test('[POST] /accounts: Deve criar uma conta', async () => {
    await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'Dávison Mota',
        email: 'contato@davison.com',
        password: '123',
      })
      .expect(201);

    const userOnDatabase = await prismaService.user.findUnique({
      where: {
        email: 'contato@davison.com',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
