import { NotificationsRepository } from '@/domain/notification/application/repositories/NotificationsRepository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  readonly items: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.getId() === id);

    if (!notification) return null;

    return notification;
  }

  async save(notification: Notification): Promise<void> {
    const notificationIndex = this.items.findIndex(
      (item) => item.getId() === notification.getId(),
    );

    this.items[notificationIndex] = notification;
  }
}
