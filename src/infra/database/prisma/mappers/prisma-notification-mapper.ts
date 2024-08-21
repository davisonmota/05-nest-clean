import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { Notification as PrismaNotification } from '@prisma/client';

export class PrismaNotificationMapper {
  static toDomain(notificationData: PrismaNotification): Notification {
    return Notification.create(
      {
        title: notificationData.title,
        content: notificationData.content,
        recipientId: new UniqueEntityID(notificationData.recipientId),
        createdAt: notificationData.createdAt,
        readAt: notificationData.readAt,
      },
      new UniqueEntityID(notificationData.id),
    );
  }

  static toPrisma(notification: Notification): PrismaNotification {
    return {
      id: notification.getId(),
      title: notification.getTitle(),
      content: notification.getContent(),
      createdAt: notification.getCreatedAt(),
      recipientId: notification.getRecipientId(),
      readAt: notification.getReadAt(),
    };
  }
}
