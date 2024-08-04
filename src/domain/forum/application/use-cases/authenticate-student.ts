import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Encrypt } from '../cryptography/encrypt';
import { HashComparator } from '../cryptography/hasher-comparator';
import { StudentsRepository } from '../repositories/students-repository';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

type Input = {
  email: string;
  password: string;
};

type Output = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly hashComparator: HashComparator,
    private readonly encrypt: Encrypt,
  ) {}

  async execute({ email, password }: Input): Promise<Output> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const isMatchPassword = await this.hashComparator.compare(
      password,
      student.getPassword(),
    );

    if (!isMatchPassword) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypt.encrypt({ sub: student.getId() });

    return right({ accessToken });
  }
}
