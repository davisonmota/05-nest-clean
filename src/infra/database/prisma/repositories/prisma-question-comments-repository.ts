import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';
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

      take: 20,
      skip: (page - 1) * 20,
    });

    return questionCommentsData.map(PrismaQuestionCommentMapper.toDomain);
  }
}
