import { InMemoryNotificationsRepository } from '@/infra/repositories/in-memory-notifications-repository';
import { describe, expect, test } from 'vitest';
import { SendNotificationUseCase } from './send-notification';

describe('Send Notification Use Case', () => {
  test('deve enviar uma notificação', async () => {
    const inMemoryNotificationsRepository =
      new InMemoryNotificationsRepository();

    const sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    const result = await sendNotificationUseCase.execute({
      recipientId: '1',
      title: 'Nova Notificação (notification)',
      content: 'Conteúdo da notificação (notification)',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.notification.id).toBeTruthy();
    expect(result.value?.notification.recipientId).toBeTruthy();
    expect(result.value?.notification.title).toBe(
      'Nova Notificação (notification)',
    );
    expect(result.value?.notification.content).toBe(
      'Conteúdo da notificação (notification)',
    );
    expect(result.value?.notification.createdAt).toBeInstanceOf(Date);
    expect(result.value?.notification.readAt).toBeUndefined();
  });
});
