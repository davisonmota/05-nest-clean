import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Student } from '../../enterprise/entities/student';
import { HashGenerator } from '../cryptography/hasher-generator';
import { StudentsRepository } from '../repositories/students-repository';
import { StudentAlreadyExistsError } from './errors/student-alreary-exists-error';

type Input = {
  name: string;
  email: string;
  password: string;
};

type Output = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({ name, email, password }: Input): Promise<Output> {
    const studentWithSameEmail =
      await this.studentsRepository.findByEmail(email);

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.studentsRepository.create(student);
    return right({
      student,
    });
  }
}
