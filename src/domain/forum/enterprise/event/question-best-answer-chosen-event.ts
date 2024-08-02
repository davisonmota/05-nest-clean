import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/domain/events/domain-event';
import { Question } from '../entities/question';

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  ocurredAt: Date;
  question: Question;
  bestAnswerId: UniqueEntityID;

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question;
    this.bestAnswerId = bestAnswerId;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return new UniqueEntityID(this.question.getId());
  }
}
