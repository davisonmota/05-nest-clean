import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return;
    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);
    await this.prismaService.attachment.updateMany(data);
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return;
    const attachmentIds = attachments.map((attachment) => attachment.getId());
    await this.prismaService.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    });
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachmentsData =
      await this.prismaService.attachment.findMany({
        where: {
          questionId,
        },
      });

    return questionAttachmentsData.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}
