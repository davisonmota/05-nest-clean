import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotificationsRepository } from '../repositories/NotificationsRepository';

type Input = {
  recipientId: string;
  notificationId: string;
};

type Output = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: {
      id: string;
      recipientId: string;
      title: string;
      content: string;
      readAt?: Date;
      createdAt: Date;
    };
  }
>;

export class ReadNotificationUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({ recipientId, notificationId }: Input): Promise<Output> {
    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (notification.getRecipientId() !== recipientId) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

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
