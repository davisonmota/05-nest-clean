import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { Notification } from '../../enterprise/entities/notification';
import { NotificationsRepository } from '../repositories/NotificationsRepository';

type Input = {
  recipientId: string;
  title: string;
  content: string;
};

type Output = Either<
  null,
  {
    notification: {
      id: string;
      recipientId: string;
      title: string;
      content: string;
      readAt?: Date | null;
      createdAt: Date;
    };
  }
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({ recipientId, title, content }: Input): Promise<Output> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    return right({
      notification: {
        id: notification.getId(),
        title: notification.getTitle(),
        content: notification.getContent(),
        createdAt: notification.getCreatedAt(),
        recipientId: notification.getRecipientId(),
        readAt: notification.getReadAt(),
      },
    });
  }
}
