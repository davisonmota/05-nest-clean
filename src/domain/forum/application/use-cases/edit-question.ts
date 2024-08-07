import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

type Input = {
  userId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
};

type Output = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: {
      id: string;
      title: string;
      slug: string;
      content: string;
      authorId: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
>;

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionsAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    userId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: Input): Promise<Output> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== question.getAuthorId()) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionsAttachmentsRepository.findManyByQuestionId(
        questionId,
      );

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: new UniqueEntityID(question.getId()),
      });
    });

    questionAttachmentList.update(questionAttachments);
    question.setAttachments(questionAttachmentList);

    question.setTitle(title);
    question.setContent(content);

    await this.questionsRepository.save(question);

    return right({
      question: {
        id: question.getId(),
        authorId: question.getAuthorId(),
        title: question.getTitle(),
        content: question.getContent(),
        slug: question.getSlug(),
        createdAt: question.getCreatedAt(),
        updatedAt: question.getUpdatedAt()!,
      },
    });
  }
}
