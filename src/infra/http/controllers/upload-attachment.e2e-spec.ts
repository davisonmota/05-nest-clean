import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';

describe('Upload Attachments (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /attachments - Deve fazer upload de arquivos', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.getId() });

    await request(app.getHttpServer())
      .post(`/attachments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/exemple-simple-upload.png')
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
