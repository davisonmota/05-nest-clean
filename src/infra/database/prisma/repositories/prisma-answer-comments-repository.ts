import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper';
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

      take: 20,
      skip: (page - 1) * 20,
    });

    return answerCommentsData.map(PrismaAnswerCommentMapper.toDomain);
  }
}
