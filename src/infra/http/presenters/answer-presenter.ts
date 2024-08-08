import { Answer } from '@/domain/forum/enterprise/entities/answer';

export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      id: answer.getId(),
      content: answer.getContent(),
      createdAt: answer.getCreatedAt(),
      updatedAt: answer.getUpdatedAt() ?? null,
    };
  }
}
