import { Either, right } from '@/core/either';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

type Input = {
  answerId: string;
  page: number;
};

type AnswerCommentDTO = {
  id: string;
  authorId: string;
  answerId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
};

type Output = Either<
  null,
  {
    answerComments: AnswerCommentDTO[];
  }
>;

export class FetAnswerCommentUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({ answerId, page }: Input): Promise<Output> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    const answerCommentDTO: AnswerCommentDTO[] = answerComments.map(
      (answerComment) => {
        return {
          id: answerComment.getId(),
          authorId: answerComment.getAuthorId(),
          answerId: answerComment.getAnswerId(),
          content: answerComment.getContent(),
          createdAt: answerComment.getCreatedAt(),
          updatedAt: answerComment.getUpdatedAt(),
        };
      },
    );

    return right({
      answerComments: answerCommentDTO,
    });
  }
}
