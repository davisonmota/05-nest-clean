import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/domain/events/domain-event';
import { Answer } from '../entities/answer';

export class AnswerCreatedEvent implements DomainEvent {
  ocurredAt: Date;

  constructor(public answer: Answer) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return new UniqueEntityID(this.answer.getId());
  }
}
