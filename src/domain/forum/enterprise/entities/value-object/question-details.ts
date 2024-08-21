import { ValueObject } from '@/core/entities/value-object';
import { Attachment } from '../attachment';

export interface QuestionDetailsProps {
  questionId: string;
  author: {
    id: string;
    name: string;
  };
  title: string;
  content: string;
  slug: string;
  attachments: Attachment[];
  bestAnswerId?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  static create(props: QuestionDetailsProps): QuestionDetails {
    return new QuestionDetails(props);
  }

  getQuestionId(): string {
    return this.props.questionId;
  }

  getAuthorId(): string {
    return this.props.author.id;
  }

  getAuthorName(): string {
    return this.props.author.name;
  }

  getTitle(): string {
    return this.props.title;
  }

  getContent(): string {
    return this.props.content;
  }

  getSlug(): string {
    return this.props.slug;
  }

  getAttachments(): Attachment[] {
    return this.props.attachments;
  }

  getBestAnswerId(): string | null | undefined {
    return this.props.bestAnswerId;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getUpdatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }
}
