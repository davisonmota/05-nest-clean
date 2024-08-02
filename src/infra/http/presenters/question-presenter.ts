import { Question } from '@/domain/forum/enterprise/entities/question';

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.getId(),
      title: question.getTitle(),
      slug: question.getSlug(),
      bestAnswerId: question.getBestAnswerId() ?? null,
      createdAt: question.getCreatedAt(),
      updatedAt: question.getUpdatedAt() ?? null,
    };
  }
}
