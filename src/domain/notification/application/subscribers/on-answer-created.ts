import { DomainEvents } from '@/domain/events/domain-events';
import { EventHandler } from '@/domain/events/event-handle';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/event/answer-created-event';
import { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionRepository.findById(
      answer.getQuestionId(),
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.getAuthorId(),
        title: `Nova resposta em "${question.getTitle().substring(0, 40).concat('...')}"`,
        content: answer.getExcept(),
      });
    }
  }
}
