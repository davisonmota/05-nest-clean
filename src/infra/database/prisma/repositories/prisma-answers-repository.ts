import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/domain/events/domain-events';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prismaService: PrismaService,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    const answerData = PrismaAnswerMapper.toPrisma(answer);
    await this.prismaService.answer.create({
      data: answerData,
    });

    await this.answerAttachmentsRepository.createMany(
      answer.getAttachments().getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(new UniqueEntityID(answer.getId()));
  }

  async save(answer: Answer): Promise<void> {
    const answerData = PrismaAnswerMapper.toPrisma(answer);
    await Promise.all([
      this.prismaService.answer.update({
        where: {
          id: answer.getId(),
        },
        data: answerData,
      }),
      this.answerAttachmentsRepository.createMany(
        answer.getAttachments().getNewItems(),
      ),
      this.answerAttachmentsRepository.deleteMany(
        answer.getAttachments().getRemovedItems(),
      ),
    ]);

    DomainEvents.dispatchEventsForAggregate(new UniqueEntityID(answer.getId()));
  }

  async findById(id: string): Promise<Answer | null> {
    const answerData = await this.prismaService.answer.findUnique({
      where: {
        id,
      },
    });
    if (!answerData) return null;

    return PrismaAnswerMapper.toDomain(answerData);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answersData = await this.prismaService.answer.findMany({
      where: {
        questionId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answersData.map(PrismaAnswerMapper.toDomain);
  }

  async delete(answer: Answer): Promise<void> {
    await this.prismaService.answer.delete({
      where: {
        id: answer.getId(),
      },
    });
  }
}
