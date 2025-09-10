import { TYPE } from '../../../infrastructure/config/inversify-type';
import { VerifyToken } from '../../domain/errors/verify-token.error';
import { Ok, Result } from '../../domain/utils/result';
import { inject, injectable } from 'inversify';
import { UserTokenRepository } from '../../ports/repositories/user-token.repository';
import { UserRepository } from '../../ports/repositories/user.repository';

@injectable()
export class VerifyUserUseCase {
  constructor(
    @inject(TYPE.UserTokenRepository)
    private readonly userTokenRepository: UserTokenRepository,
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(validationToken: string): Promise<Result<null, VerifyToken>> {
    console.log(validationToken);
    return Ok(null);
  }
}
