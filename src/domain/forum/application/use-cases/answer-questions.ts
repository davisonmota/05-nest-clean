import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswersRepository } from '../repositories/answers-repository';

type Input = {
  instructorId: string;
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

export class AnswerQuestionsUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: Input): Promise<Output> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(instructorId),
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
