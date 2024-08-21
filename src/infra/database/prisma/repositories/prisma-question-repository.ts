import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/domain/events/domain-events';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-object/question-details';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prismaService: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const questionData = PrismaQuestionMapper.toPrisma(question);
    await this.prismaService.question.create({
      data: questionData,
    });

    await this.questionAttachmentsRepository.createMany(
      question.getAttachments().getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(
      new UniqueEntityID(question.getId()),
    );
  }

  async save(question: Question): Promise<void> {
    const questionData = PrismaQuestionMapper.toPrisma(question);
    await Promise.all([
      this.prismaService.question.update({
        where: {
          id: question.getId(),
        },
        data: questionData,
      }),
      this.questionAttachmentsRepository.createMany(
        question.getAttachments().getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.getAttachments().getRemovedItems(),
      ),
    ]);

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

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const questionDetailsData = await this.prismaService.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    });
    if (!questionDetailsData) return null;

    return PrismaQuestionDetailsMapper.toDomain(questionDetailsData);
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
    await this.prismaService.question.delete({
      where: {
        id: question.getId(),
      },
    });
  }
}
