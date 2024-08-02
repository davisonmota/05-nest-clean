import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface CommentProps {
  authorId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
  getContent(): string {
    return this.props.content;
  }

  setContent(content: string): void {
    this.props.content = content;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  getAuthorId(): string {
    return this.props.authorId.getValue();
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
