import { Either, right } from '@/core/either';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

type Input = {
  questionId: string;
  page: number;
};

type QuestionCommentDTO = {
  id: string;
  authorId: string;
  questionId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
};

type Output = Either<
  null,
  {
    questionComments: QuestionCommentDTO[];
  }
>;

export class FetQuestionCommentUseCase {
  constructor(
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({ questionId, page }: Input): Promise<Output> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      });

    const questionCommentDTO: QuestionCommentDTO[] = questionComments.map(
      (questionComment) => {
        return {
          id: questionComment.getId(),
          authorId: questionComment.getAuthorId(),
          questionId: questionComment.getQuestionId(),
          content: questionComment.getContent(),
          createdAt: questionComment.getCreatedAt(),
          updatedAt: questionComment.getUpdatedAt(),
        };
      },
    );

    return right({
      questionComments: questionCommentDTO,
    });
  }
}
