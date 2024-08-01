import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

// const createQuestionBodySchema = z.object({
//   title: z.string(),
//   content: z.string(),
//   authorId: z.string().uuid(),
// });

// type createQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(
    private readonly swtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  // @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user.sub);
    return 'ok';
  } // @Body() { authorId, title, content }: createQuestionBodySchema,
}
