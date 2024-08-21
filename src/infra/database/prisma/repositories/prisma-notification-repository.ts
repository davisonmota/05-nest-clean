import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvents } from '@/domain/events/domain-events';
import { NotificationsRepository } from '@/domain/notification/application/repositories/NotificationsRepository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { Injectable } from '@nestjs/common';
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const notificationData = PrismaNotificationMapper.toPrisma(notification);
    await this.prismaService.notification.create({
      data: notificationData,
    });

    DomainEvents.dispatchEventsForAggregate(
      new UniqueEntityID(notification.getId()),
    );
  }

  async save(notification: Notification): Promise<void> {
    const notificationData = PrismaNotificationMapper.toPrisma(notification);

    await this.prismaService.notification.update({
      where: {
        id: notification.getId(),
      },
      data: notificationData,
    });

    DomainEvents.dispatchEventsForAggregate(
      new UniqueEntityID(notification.getId()),
    );
  }

  async findById(id: string): Promise<Notification | null> {
    const notificationData = await this.prismaService.notification.findUnique({
      where: {
        id,
      },
    });
    if (!notificationData) return null;

    return PrismaNotificationMapper.toDomain(notificationData);
  }
}
