import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string().uuid()),
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private readonly editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
    @Body(new ZodValidationPipe(editAnswerBodySchema))
    { content, attachmentsIds }: EditAnswerBodySchema,
  ) {
    const userId = user.sub;

    const result = await this.editAnswer.execute({
      userId,
      answerId,
      content,
      attachmentsIds,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
