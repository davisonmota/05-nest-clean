import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { z } from 'zod';

const pageQueryParamSchema = z.coerce.number().min(1).optional().default(1);
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(
    private readonly swtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 20;
    const questions = await this.prismaService.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { questions };
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
