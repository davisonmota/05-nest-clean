import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { AnswerCreatedEvent } from '../event/answer-created-event';
import { AnswerAttachmentList } from './answer-attachment-list';

export interface AnswerProps {
  authorId: UniqueEntityID;
  questionId: UniqueEntityID;
  content: string;
  attachments: AnswerAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends AggregateRoot<AnswerProps> {
  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ): Answer {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    const isNewAnswer = !id;
    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }
    return answer;
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

  getAuthorId(): string {
    return this.props.authorId.getValue();
  }

  getQuestionId(): string {
    return this.props.questionId.getValue();
  }

  getAttachments(): AnswerAttachmentList {
    return this.props.attachments;
  }

  setAttachments(attachments: AnswerAttachmentList): void {
    this.props.attachments = attachments;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
