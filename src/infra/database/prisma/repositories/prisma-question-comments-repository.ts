import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author';
import { Injectable } from '@nestjs/common';
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper';
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(questionComment: QuestionComment): Promise<void> {
    const questionCommentData =
      PrismaQuestionCommentMapper.toPrisma(questionComment);
    await this.prismaService.comment.create({
      data: questionCommentData,
    });
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionCommentData = await this.prismaService.comment.findUnique({
      where: {
        id,
      },
    });
    if (!questionCommentData) return null;

    return PrismaQuestionCommentMapper.toDomain(questionCommentData);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: {
        id: questionComment.getId(),
      },
    });
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionCommentsData = await this.prismaService.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questionCommentsData.map(PrismaQuestionCommentMapper.toDomain);
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const commentWithAuthorData = await this.prismaService.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return commentWithAuthorData.map(PrismaCommentWithAuthorMapper.toDomain);
  }
}
