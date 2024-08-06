import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Prisma, User as PrismaUser } from '@prisma/client';

export class PrismaStudentMapper {
  static toDomain(studentData: PrismaUser): Student {
    return Student.create(
      {
        name: studentData.name,
        email: studentData.email,
        password: studentData.password,
      },
      new UniqueEntityID(studentData.id),
    );
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.getId(),
      name: student.getName(),
      email: student.getEmail(),
      password: student.getPassword(),
    };
  }
}
