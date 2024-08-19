import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author';
import { InMemoryStudentsRepository } from './in-memory-students-repository';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  readonly items: QuestionComment[] = [];

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment);
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.getId() === id);

    if (!questionComment) return null;

    return questionComment;
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const indexItem = this.items.findIndex(
      (item) => item.getId() === questionComment.getId(),
    );
    this.items.splice(indexItem, 1);
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionComments = this.items
      .filter(
        (questionComment) => questionComment.getQuestionId() === questionId,
      )
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

    return questionComments;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter(
        (questionComment) => questionComment.getQuestionId() === questionId,
      )
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }
}
