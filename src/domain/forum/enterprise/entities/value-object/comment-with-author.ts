import { ValueObject } from '@/core/entities/value-object';

export interface CommentWithAuthorProps {
  commentId: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt?: Date | null;
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  static create(props: CommentWithAuthorProps): CommentWithAuthor {
    return new CommentWithAuthor(props);
  }

  getCommentId(): string {
    return this.props.commentId;
  }

  getContent(): string {
    return this.props.content;
  }

  getAuthorId(): string {
    return this.props.author.id;
  }

  getAuthorName(): string {
    return this.props.author.name;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getUpdatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }
}
