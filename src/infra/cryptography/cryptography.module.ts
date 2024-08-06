import { Encrypt } from '@/domain/forum/application/cryptography/encrypt';
import { HashComparator } from '@/domain/forum/application/cryptography/hasher-comparator';
import { HashGenerator } from '@/domain/forum/application/cryptography/hasher-generator';
import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';
import { JwtEncrytper } from './jwt-encrypter';

@Module({
  providers: [
    { provide: Encrypt, useClass: JwtEncrytper },
    { provide: HashComparator, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypt, HashComparator, HashGenerator],
})
export class CryptographyModule {}
