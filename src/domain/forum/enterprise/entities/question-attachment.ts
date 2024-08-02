import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface QuestionAttachmentProps {
  questionId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  static create(
    props: QuestionAttachmentProps,
    id?: UniqueEntityID,
  ): QuestionAttachment {
    const attachment = new QuestionAttachment(props, id);
    return attachment;
  }

  getQuestionId(): string {
    return this.props.questionId.getValue();
  }

  getAttachmentId(): string {
    return this.props.attachmentId.getValue();
  }
}
