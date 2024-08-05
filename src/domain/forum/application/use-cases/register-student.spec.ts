import { FakeHasher } from 'test/cryptography/faker-hash';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { describe, test } from 'vitest';
import { HashGenerator } from '../cryptography/hasher-generator';
import { RegisterStudentUseCase } from './register-student';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakerHashGenerator: HashGenerator;
let sut: RegisterStudentUseCase;

describe('Register Student Use Case', () => {
  beforeEach(async () => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakerHashGenerator = new FakeHasher();
    sut = new RegisterStudentUseCase(
      inMemoryStudentsRepository,
      fakerHashGenerator,
    );
  });

  test('deve registrar um estudante (student)', async () => {
    const result = await sut.execute({
      name: 'Dávison',
      email: 'davison@gmail.com',
      password: '123',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  test('deve criptografar (hash) a senha do estudante (student) ao registrá-lo', async () => {
    await sut.execute({
      name: 'Dávison',
      email: 'davison@gmail.com',
      password: '123',
    });

    expect(inMemoryStudentsRepository.items[0].getPassword()).toBe(
      '123-hashed',
    );
  });
});
