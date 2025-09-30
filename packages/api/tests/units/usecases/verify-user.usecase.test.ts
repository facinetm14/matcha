import { describe } from 'node:test';
import { uuid } from '../../../../shared/uuid';
import { VerifyUserUseCase } from '../../../src/core/usecases/auth/verify-user.usecase';
import { VerifyTokenError } from '../../../src/core/domain/errors/verify-token.error';
import {
  factoryUserRepositoryInMemory,
  factoryUserToken,
  factoryUserTokenRepositoryInMemory,
} from '../../../../shared/factory';
import { UserTokenRepository } from '../../../src/core/ports/repositories/user-token.repository';

describe('Verify user email', () => {
  let token: string;
  let verifyUserUseCase: VerifyUserUseCase;
  let userTokenRepository: UserTokenRepository;

  beforeAll(() => {
    token = uuid();
    userTokenRepository = factoryUserTokenRepositoryInMemory();

    verifyUserUseCase = new VerifyUserUseCase(
      userTokenRepository,
      factoryUserRepositoryInMemory(),
    );
  });

  test('should return error when token is invalid', async () => {
    const verfyUserResult = await verifyUserUseCase.execute(token);

    expect(verfyUserResult).toMatchObject({
      isErr: true,
      error: VerifyTokenError.INVALID_TOKEN,
    });
  });

  test('should return ok when token is valid', async () => {
    const userToken = await  userTokenRepository.create(factoryUserToken({}));

    const verfyUserResult = await verifyUserUseCase.execute(`${userToken}`);

    expect(verfyUserResult).toMatchObject({
      isErr: false,
    });
  });

  test('should return error when token is already used', async () => {
    const verfyUserResult = await verifyUserUseCase.execute(token);

    expect(verfyUserResult).toMatchObject({
      isErr: true,
      error: VerifyTokenError.INVALID_TOKEN,
    });
  });
});
