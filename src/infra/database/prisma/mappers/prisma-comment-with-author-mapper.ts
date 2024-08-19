import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author';
import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client';

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser;
};

export class PrismaCommentWithAuthorMapper {
  static toDomain(
    commentWithAuthorData: PrismaCommentWithAuthor,
  ): CommentWithAuthor {
    return CommentWithAuthor.create({
      author: {
        id: commentWithAuthorData.author.id,
        name: commentWithAuthorData.author.name,
      },
      commentId: commentWithAuthorData.id,
      content: commentWithAuthorData.content,
      createdAt: commentWithAuthorData.createdAt,
      updatedAt: commentWithAuthorData.updatedAt,
    });
  }
}
