import { Either, right } from '@/core/either';
import { QuestionsRepository } from '../repositories/questions-repository';

type Input = {
  page: number;
};

type QuestionDTO = {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  createdAt: Date;
  getBestAnswerId?: string;
  getUpdatedAt?: Date;
  isNew: boolean;
};

type Output = Either<
  null,
  {
    questions: QuestionDTO[];
  }
>;

export class FetRecentQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ page }: Input): Promise<Output> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    const questionsDTO: QuestionDTO[] = questions.map((question) => {
      return {
        id: question.getId(),
        authorId: question.getAuthorId(),
        title: question.getTitle(),
        content: question.getContent(),
        slug: question.getSlug(),
        createdAt: question.getCreatedAt(),
        getUpdatedAt: question.getUpdatedAt(),
        getBestAnswerId: question.getBestAnswerId(),
        isNew: question.isNew(),
      };
    });

    return right({
      questions: questionsDTO,
    });
  }
}
