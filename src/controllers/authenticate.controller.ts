import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { z } from 'zod';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type authenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly swtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() { email, password }: authenticateBodySchema) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User credentials invalid.');
    }

    const isMatchPassword = await compare(password, user.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException('User credentials invalid.');
    }

    const accessToken = this.swtService.sign({ sub: user.id });
    return { accessToken };
  }
}
