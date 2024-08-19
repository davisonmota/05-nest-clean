import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryStudentsRepository implements StudentsRepository {
  readonly items: Student[] = [];

  async create(student: Student): Promise<void> {
    this.items.push(student);
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.getEmail() === email);

    if (!student) return null;

    return student;
  }
}
