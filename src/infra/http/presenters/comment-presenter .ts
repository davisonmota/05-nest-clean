import { Comment } from '@/domain/forum/enterprise/entities/comment';

export class CommentPresenter {
  static toHTTP(comment: Comment<any>) {
    return {
      id: comment.getId(),
      content: comment.getContent(),
      createdAt: comment.getCreatedAt(),
      updatedAt: comment.getUpdatedAt() ?? null,
    };
  }
}
