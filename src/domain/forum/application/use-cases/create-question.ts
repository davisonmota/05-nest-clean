import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question } from '../../enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionsRepository } from '../repositories/questions-repository';

type Input = {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
};

type Output = Either<
  null,
  {
    question: {
      id: string;
      title: string;
      slug: string;
      content: string;
      authorId: string;
      createdAt: Date;
    };
  }
>;

export class CreateQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: Input): Promise<Output> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    });

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: new UniqueEntityID(question.getId()),
      });
    });

    question.setAttachments(new QuestionAttachmentList(questionAttachments));

    await this.questionsRepository.create(question);

    return right({
      question: {
        id: question.getId(),
        authorId: question.getAuthorId(),
        title: question.getTitle(),
        content: question.getContent(),
        slug: question.getSlug(),
        createdAt: question.getCreatedAt(),
      },
    });
  }
}
