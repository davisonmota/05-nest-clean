import { HashComparator } from '@/domain/forum/application/cryptography/hasher-comparator';
import { HashGenerator } from '@/domain/forum/application/cryptography/hasher-generator';

export class FakeHasher implements HashGenerator, HashComparator {
  async hash(pain: string): Promise<string> {
    return pain.concat('-hashed');
  }
  async compare(pain: string, hash: string): Promise<boolean> {
    return pain.concat('-hashed') === hash;
  }
}
