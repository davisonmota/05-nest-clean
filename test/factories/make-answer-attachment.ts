import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
): AnswerAttachment {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );
  return answerAttachment;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaAnswerAttachment(
    data: Partial<AnswerAttachmentProps> = {},
  ): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data);

    await this.prismaService.attachment.update({
      where: {
        id: answerAttachment.getAttachmentId(),
      },
      data: {
        answerId: answerAttachment.getAnswerId(),
      },
    });

    return answerAttachment;
  }
}
