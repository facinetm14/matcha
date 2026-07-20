import { describe } from 'node:test';
import { uuid } from '../../../../shared/uuid';
import { VerifyUserUseCase } from '../../../src/modules/auth/application/usecases/verify-user.usecase';
import { VerifyTokenError } from '../../../src/modules/auth/application/errors/verify-token.error';
import {
  factoryUserRepositoryInMemory,
  factoryUserToken,
  factoryUserTokenRepositoryInMemory,
} from '../../../src/modules/shared/utils/factory';
import { UserTokenRepository } from '../../../src/modules/auth/application/ports/repositories/user-token.repository';

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
    const userToken = await userTokenRepository.create(factoryUserToken({}));

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
