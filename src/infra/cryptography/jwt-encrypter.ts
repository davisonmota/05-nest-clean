import { Encrypt } from '@/domain/forum/application/cryptography/encrypt';
import { JwtService } from '@nestjs/jwt';

export class JwtEncrytper implements Encrypt {
  constructor(private readonly jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
