import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(
    private readonly swtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    { title, content }: CreateQuestionBodySchema,
  ) {
    const userId = user.sub;
    const slug = this.converteToSlug(title);

    await this.prismaService.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    });
  }

  private converteToSlug(title: string) {
    return title
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w]+/g, '-')
      .replace(/_/g, '-')
      .replace(/--/g, '-')
      .replace(/-$/g, '');
  }
}
