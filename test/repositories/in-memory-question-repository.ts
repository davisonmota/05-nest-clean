import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/domain/events/domain-events';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-object/question-details';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository';
import { InMemoryStudentsRepository } from './in-memory-students-repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  readonly items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.items.push(question);
    this.questionAttachmentsRepository.createMany(
      question.getAttachments().getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(
      new UniqueEntityID(question.getId()),
    );
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.getId() === question.getId(),
    );

    this.items[questionIndex] = question;

    this.questionAttachmentsRepository.createMany(
      question.getAttachments().getNewItems(),
    );
    this.questionAttachmentsRepository.deleteMany(
      question.getAttachments().getRemovedItems(),
    );
    DomainEvents.dispatchEventsForAggregate(
      new UniqueEntityID(question.getId()),
    );
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.getSlug() === slug);

    if (!question) return null;

    return question;
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.getSlug() === slug);

    if (!question) return null;

    const author = this.studentsRepository.items.find(
      (student) => student.getId() === question.getAuthorId(),
    );

    if (!author) {
      throw new Error(`Author with ID "${question.getId()} does not exists."`);
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachments) => {
        return questionAttachments.getQuestionId() === question.getId();
      },
    );

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.getId() === questionAttachment.getId();
      });

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.getAttachmentId()} does not exists."`,
        );
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.getId(),
      author: {
        id: author.getId(),
        name: author.getName(),
      },
      title: question.getTitle(),
      content: question.getContent(),
      slug: question.getSlug(),
      attachments,
      bestAnswerId: question.getBestAnswerId(),
      createdAt: question.getCreatedAt(),
      updatedAt: question.getUpdatedAt(),
    });
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.getId() === id);

    if (!question) return null;

    return question;
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime())
      .splice((page - 1) * 20, page * 20);

    return questions;
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
