import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface NotificationProps {
  recipientId: UniqueEntityID;
  title: string;
  content: string;
  readAt?: Date;
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Notification {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return notification;
  }

  getRecipientId(): string {
    return this.props.recipientId.getValue();
  }

  getTitle(): string {
    return this.props.title;
  }

  getContent(): string {
    return this.props.content;
  }

  read(): void {
    this.props.readAt = new Date();
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getReadAt(): Date | undefined {
    return this.props.readAt;
  }
}
