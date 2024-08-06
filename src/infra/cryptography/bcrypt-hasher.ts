import { HashComparator } from '@/domain/forum/application/cryptography/hasher-comparator';
import { HashGenerator } from '@/domain/forum/application/cryptography/hasher-generator';
import { compare, hash } from 'bcryptjs';

export class BcryptHasher implements HashComparator, HashGenerator {
  constructor(private readonly salt: number = 8) {}

  hash(plain: string): Promise<string> {
    return hash(plain, this.salt);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
