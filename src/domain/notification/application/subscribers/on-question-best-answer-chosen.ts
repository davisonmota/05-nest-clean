import { DomainEvents } from '@/domain/events/domain-events';
import { EventHandler } from '@/domain/events/event-handle';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/event/question-best-answer-chosen-event';
import { Injectable } from '@nestjs/common';
import { SendNotificationUseCase } from '../use-cases/send-notification';

@Injectable()
export class OnQuestionBestAnswerChosenEvent implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.getValue(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.getAuthorId(),
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que você enviou em "${question.getTitle().substring(0, 20).concat('...')}" foi escolhida pelo author!`,
      });
    }
  }
}
