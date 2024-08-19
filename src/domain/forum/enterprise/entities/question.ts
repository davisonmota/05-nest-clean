import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import dayjs from 'dayjs';
import { QuestionBestAnswerChosenEvent } from '../event/question-best-answer-chosen-event';
import { QuestionAttachmentList } from './question-attachment-list';
import { Slug } from './value-object/Slug';

export interface QuestionProps {
  title: string;
  slug: Slug;
  content: string;
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ): Question {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return question;
  }

  getTitle(): string {
    return this.props.title;
  }

  setTitle(title: string): void {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);
    this.touch();
  }

  getSlug(): string {
    return this.props.slug.getValue();
  }

  getContent(): string {
    return this.props.content;
  }

  setContent(content: string): void {
    this.props.content = content;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  getExcept(): string {
    return this.getContent().substring(0, 120).trimEnd().concat('...');
  }

  getBestAnswerId(): string | undefined {
    return this.props.bestAnswerId?.getValue();
  }

  setBestAnswerId(bestAnswerId: UniqueEntityID | undefined): void {
    if (bestAnswerId && bestAnswerId.getValue() !== this.getBestAnswerId()) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId),
      );
    }
    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }

  getAuthorId(): string {
    return this.props.authorId.getValue();
  }

  getAttachments(): QuestionAttachmentList {
    return this.props.attachments;
  }

  setAttachments(attachments: QuestionAttachmentList): void {
    this.props.attachments = attachments;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  isNew(): boolean {
    return dayjs().diff(this.getCreatedAt(), 'days') <= 3;
  }
}
