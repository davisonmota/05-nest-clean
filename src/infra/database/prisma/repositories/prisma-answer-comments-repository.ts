import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper';
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(answerComment: AnswerComment): Promise<void> {
    const answerCommentData = PrismaAnswerCommentMapper.toPrisma(answerComment);
    await this.prismaService.comment.create({
      data: answerCommentData,
    });
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerCommentData = await this.prismaService.comment.findUnique({
      where: {
        id,
      },
    });
    if (!answerCommentData) return null;

    return PrismaAnswerCommentMapper.toDomain(answerCommentData);
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: {
        id: answerComment.getId(),
      },
    });
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerCommentsData = await this.prismaService.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answerCommentsData.map(PrismaAnswerCommentMapper.toDomain);
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const commentWithAuthorData = await this.prismaService.comment.findMany({
      where: {
        answerId,
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
