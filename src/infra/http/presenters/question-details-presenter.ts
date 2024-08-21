import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-object/question-details';
import { AttachmentPresenter } from './attachment-presenter';

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.getQuestionId(),
      authorId: questionDetails.getAuthorId(),
      author: questionDetails.getAuthorName(),
      title: questionDetails.getTitle(),
      slug: questionDetails.getSlug(),
      content: questionDetails.getContent(),
      attachments: questionDetails
        .getAttachments()
        .map(AttachmentPresenter.toHTTP),
      bestAnswerId: questionDetails.getBestAnswerId() ?? null,
      createdAt: questionDetails.getCreatedAt(),
      updatedAt: questionDetails.getUpdatedAt() ?? null,
    };
  }
}
