import { FetAnswerCommentUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CommentPresenter } from '../presenters/comment-presenter ';

const pageQueryParamSchema = z.coerce.number().min(1).optional().default(1);
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(
    private readonly fetchAnswerCommentsUseCase: FetAnswerCommentUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerCommentsUseCase.execute({
      page,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { answerComments } = result.value;

    return { answersComments: answerComments.map(CommentPresenter.toHTTP) };
  }
}
