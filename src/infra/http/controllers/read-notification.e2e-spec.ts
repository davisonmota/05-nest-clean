import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { NotificationFactory } from 'test/factories/make-notification';
import { StudentFactory } from 'test/factories/make-student';

describe('Read Notification (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;
  let notificationFactory: NotificationFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    notificationFactory = moduleRef.get(NotificationFactory);
    jwtService = moduleRef.get(JwtService);
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[PATCH] /notifications/:notificationId/read - Deve marcar uma notificação como lida', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'Davison',
    });

    const accessToken = jwtService.sign({ sub: user.getId() });

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: new UniqueEntityID(user.getId()),
    });

    const notificationId = notification.getId();

    await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const notificationOnData = await prismaService.notification.findFirst({
      where: {
        recipientId: user.getId(),
      },
    });
    expect(notificationOnData?.readAt).not.toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
