import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/domain/events/domain-events';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionAttachmentsRepository } from './prisma-question-attachments-repository';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  readonly items: Question[] = [];

  constructor(
    private prismaService: PrismaService,
    private questionAttachmentsRepository: PrismaQuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const questionData = PrismaQuestionMapper.toPrisma(question);
    await this.prismaService.question.create({
      data: questionData,
    });

    DomainEvents.dispatchEventsForAggregate(
      new UniqueEntityID(question.getId()),
    );
  }

  async save(question: Question): Promise<void> {
    const questionData = PrismaQuestionMapper.toPrisma(question);
    await this.prismaService.question.update({
      where: {
        id: question.getId(),
      },
      data: questionData,
    });

    DomainEvents.dispatchEventsForAggregate(
      new UniqueEntityID(question.getId()),
    );
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const questionData = await this.prismaService.question.findUnique({
      where: {
        slug,
      },
    });
    if (!questionData) return null;

    return PrismaQuestionMapper.toDomain(questionData);
  }

  async findById(id: string): Promise<Question | null> {
    const questionData = await this.prismaService.question.findUnique({
      where: {
        id,
      },
    });
    if (!questionData) return null;

    return PrismaQuestionMapper.toDomain(questionData);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questionsData = await this.prismaService.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questionsData.map(PrismaQuestionMapper.toDomain);
  }

  async delete(question: Question): Promise<void> {
    const indexItem = this.items.findIndex(
      (item) => item.getId() === question.getId(),
    );
    this.items.splice(indexItem, 1);

    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.getId(),
    );
  }
}
