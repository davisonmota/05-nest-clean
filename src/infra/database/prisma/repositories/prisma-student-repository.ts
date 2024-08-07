import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(student: Student): Promise<void> {
    const studentData = PrismaStudentMapper.toPrisma(student);
    await this.prismaService.user.create({
      data: studentData,
    });
  }

  async findByEmail(email: string): Promise<Student | null> {
    const studentData = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!studentData) return null;

    return PrismaStudentMapper.toDomain(studentData);
  }
}
