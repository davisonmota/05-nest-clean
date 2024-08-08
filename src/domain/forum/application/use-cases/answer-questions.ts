import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswersRepository } from '../repositories/answers-repository';

type Input = {
  authorId: string;
  questionId: string;
  content: string;
  attachmentsIds: string[];
};

type Output = Either<
  null,
  {
    id: string;
    content: string;
  }
>;

@Injectable()
export class AnswerQuestionsUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: Input): Promise<Output> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: new UniqueEntityID(answer.getId()),
      });
    });

    answer.setAttachments(new AnswerAttachmentList(answerAttachments));

    await this.answersRepository.create(answer);

    return right({
      id: answer.getId(),
      content: answer.getContent(),
    });
  }
}
