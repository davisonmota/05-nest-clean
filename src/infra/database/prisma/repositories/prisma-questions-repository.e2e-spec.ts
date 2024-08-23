import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { AppModule } from '@/infra/app.module';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { CacheModule } from '@/infra/cache/cache.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { StudentFactory } from 'test/factories/make-student';

describe('Prisma Question Repository (e2e)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let cacheRepository: CacheRepository;
  let questionsRepository: QuestionsRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    cacheRepository = moduleRef.get(CacheRepository);
    questionsRepository = moduleRef.get(QuestionsRepository);

    await app.init();
  });

  it('deve salvar no cache os detalhe da pergunta (questionDetails)', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.getId()),
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: new UniqueEntityID(attachment.getId()),
      questionId: new UniqueEntityID(question.getId()),
    });

    const slug = question.getSlug();

    const questionDetails = await questionsRepository.findBySlug(slug);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toEqual(JSON.stringify(questionDetails));
  });

  it('deve retornar os detalhe da pergunta (questionDetails) cached', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.getId()),
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: new UniqueEntityID(attachment.getId()),
      questionId: new UniqueEntityID(question.getId()),
    });

    const slug = question.getSlug();

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ test: true }),
    );

    const questionDetails = await questionsRepository.findBySlug(slug);

    expect(questionDetails).toEqual({ test: true });
  });

  it('deve atualizar no cache os detalhe da pergunta (questionDetails) quando a pergunta os dados forem atualizados', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: new UniqueEntityID(user.getId()),
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: new UniqueEntityID(attachment.getId()),
      questionId: new UniqueEntityID(question.getId()),
    });

    const slug = question.getSlug();

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ test: true }),
    );

    await questionsRepository.save(question);

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    expect(questionDetails).not.toEqual({ test: true });
  });

  afterAll(async () => {
    await app.close();
  });
});
