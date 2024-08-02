import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  readonly items: AnswerComment[] = [];

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

  async delete(answerComment: AnswerComment): Promise<void> {
    const indexItem = this.items.findIndex(
      (item) => item.getId() === answerComment.getId(),
    );
    this.items.splice(indexItem, 1);
  }
}
