import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface AnswerAttachmentProps {
  answerId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  static create(
    props: AnswerAttachmentProps,
    id?: UniqueEntityID,
  ): AnswerAttachment {
    const attachment = new AnswerAttachment(props, id);
    return attachment;
  }

  getAnswerId(): string {
    return this.props.answerId.getValue();
  }

  getAttachmentId(): string {
    return this.props.attachmentId.getValue();
  }
}
