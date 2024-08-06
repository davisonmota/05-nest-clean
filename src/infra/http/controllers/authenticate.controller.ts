import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type authenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly authenticateStudent: AuthenticateStudentUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() { email, password }: authenticateBodySchema) {
    const result = await this.authenticateStudent.execute({ email, password });
    if (result.isLeft()) {
      throw new Error();
    }
    const { accessToken } = result.value;
    return { accessToken };
  }
}
