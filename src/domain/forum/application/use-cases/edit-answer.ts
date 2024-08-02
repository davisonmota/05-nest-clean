import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error ';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository';
import { AnswersRepository } from '../repositories/answers-repository';

type Input = {
  userId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
};

type Output = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: {
      id: string;
      content: string;
      authorId: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
>;

export class EditAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answersAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    userId,
    answerId,
    content,
    attachmentsIds,
  }: Input): Promise<Output> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== answer.getAuthorId()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answersAttachmentsRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: new UniqueEntityID(answer.getId()),
      });
    });

    answerAttachmentList.update(answerAttachments);
    answer.setAttachments(answerAttachmentList);

    answer.setContent(content);

    await this.answersRepository.save(answer);

    return right({
      answer: {
        id: answer.getId(),
        authorId: answer.getAuthorId(),
        content: answer.getContent(),
        createdAt: answer.getCreatedAt(),
        updatedAt: answer.getUpdatedAt()!,
      },
    });
  }
}
