import { HashComparator } from '@/domain/forum/application/cryptography/hasher-comparator';
import { HashGenerator } from '@/domain/forum/application/cryptography/hasher-generator';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class BcryptHasher implements HashComparator, HashGenerator {
  constructor() {}

  hash(plain: string): Promise<string> {
    return hash(plain, 8);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
