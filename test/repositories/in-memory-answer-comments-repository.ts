import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author';
import { InMemoryStudentsRepository } from './in-memory-students-repository';

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  readonly items: AnswerComment[] = [];

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment);
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.getId() === id);

    if (!answerComment) return null;

    return answerComment;
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter((answerComment) => answerComment.getAnswerId() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = this.items
      .filter((answerComment) => answerComment.getAnswerId() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.getId() === comment.getAuthorId();
        });

        if (!author) {
          throw new Error(
            `Author with ID "${comment.getAuthorId()}" does not exists`,
          );
        }
        return CommentWithAuthor.create({
          commentId: comment.getId(),
          content: comment.getContent(),
          createdAt: comment.getCreatedAt(),
          updatedAt: comment.getUpdatedAt(),
          author: {
            id: author.getId(),
            name: author.getName(),
          },
        });
      });

    return answerComments;
  }
  async delete(answerComment: AnswerComment): Promise<void> {
    const indexItem = this.items.findIndex(
      (item) => item.getId() === answerComment.getId(),
    );
    this.items.splice(indexItem, 1);
  }
}
