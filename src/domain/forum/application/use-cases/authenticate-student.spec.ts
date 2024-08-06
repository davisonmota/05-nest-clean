import { FakeEncrypt } from 'test/cryptography/faker-encrypt';
import { FakeHasher } from 'test/cryptography/faker-hash';
import { makeStudent } from 'test/factories/make-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { describe, test } from 'vitest';
import { Encrypt } from '../cryptography/encrypt';
import { AuthenticateStudentUseCase } from './authenticate-student';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakerHasher: FakeHasher;
let fakerEncrypt: Encrypt;
let sut: AuthenticateStudentUseCase;

describe('Authenticate Student Use Case', () => {
  beforeEach(async () => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakerHasher = new FakeHasher();
    fakerEncrypt = new FakeEncrypt();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakerHasher,
      fakerEncrypt,
    );
  });

  test('deve autenticar um estudante (student)', async () => {
    const student = makeStudent({
      email: 'davison@gmail.com',
      password: await fakerHasher.hash('123'),
    });

    inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      email: 'davison@gmail.com',
      password: '123',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
