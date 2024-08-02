import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { InMemoryNotificationsRepository } from '@/infra/repositories/in-memory-notifications-repository';
import { makeNotification } from 'test/factories/make-notification';
import { describe, expect, test } from 'vitest';
import { ReadNotificationUseCase } from './read-notification';

describe('Read Notification Use Case', () => {
  test('deve ler uma notificação', async () => {
    const inMemoryNotificationsRepository =
      new InMemoryNotificationsRepository();

    const readNotificationUseCase = new ReadNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    const notification = makeNotification();

    await inMemoryNotificationsRepository.create(notification);

    const result = await readNotificationUseCase.execute({
      recipientId: notification.getRecipientId(),
      notificationId: notification.getId(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0].getReadAt()).toEqual(
      expect.any(Date),
    );
  });

  test('Não deve ler uma notificação (notification) de outros usuários', async () => {
    const inMemoryNotificationsRepository =
      new InMemoryNotificationsRepository();

    const readNotificationUseCase = new ReadNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    const notification = makeNotification();

    await inMemoryNotificationsRepository.create(notification);

    const result = await readNotificationUseCase.execute({
      recipientId: 'other-user-id',
      notificationId: notification.getId(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
