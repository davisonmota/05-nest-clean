import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author';

export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAuthor: CommentWithAuthor) {
    return {
      author: {
        id: commentWithAuthor.getAuthorId(),
        name: commentWithAuthor.getAuthorName(),
      },
      commentId: commentWithAuthor.getCommentId(),
      content: commentWithAuthor.getContent(),
      createdAt: commentWithAuthor.getCreatedAt(),
      updatedAt: commentWithAuthor.getUpdatedAt(),
    };
  }
}
