import { AnswerQuestionsUseCase } from '@/domain/forum/application/use-cases/answer-questions';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { FetchRecentQuestionUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { DeleteQuestionController } from './controllers/delete-answer.controller';
import { DeleteAnswerController } from './controllers/delete-question.controller';
import { EditAnswerController } from './controllers/edit-answer.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-question.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionsUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
  ],
})
export class HttpModule {}
