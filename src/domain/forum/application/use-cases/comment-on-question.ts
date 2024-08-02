import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

type Input = {
  authorId: string;
  questionId: string;
  content: string;
};

type Output = Either<
  ResourceNotFoundError,
  {
    questionComment: {
      id: string;
      authorId: string;
      questionId: string;
      content: string;
      createdAt: Date;
      updatedAt?: Date;
    };
  }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({ authorId, questionId, content }: Input): Promise<Output> {
    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    await this.questionCommentsRepository.create(questionComment);

    return right({
      questionComment: {
        id: questionComment.getId(),
        questionId: questionComment.getQuestionId(),
        authorId: questionComment.getAuthorId(),
        content: questionComment.getContent(),
        createdAt: questionComment.getCreatedAt(),
        updatedAt: questionComment?.getUpdatedAt(),
      },
    });
  }
}
