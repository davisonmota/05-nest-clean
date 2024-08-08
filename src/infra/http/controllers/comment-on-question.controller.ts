import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
    @Body(new ZodValidationPipe(commentOnQuestionBodySchema))
    { content }: CommentOnQuestionBodySchema,
  ) {
    const userId = user.sub;

    const result = await this.commentOnQuestion.execute({
      questionId,
      content,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
