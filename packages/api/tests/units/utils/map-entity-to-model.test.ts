import { describe, expect, test } from '@jest/globals';
import { mapEnityOrDtoToModel } from '@/modules/shared/infrastructure/utils/map-entity-or-dto-to-model';
import { User } from '../../../src/modules/users/domain/entities/user.entity';
import { UserModel } from '../../../src/modules/users/infrastructure/models/user.model';
import {
  factoryUser,
  factoryUserToken,
} from '@/modules/shared/application/utils/factory';
import { UserTokenModel } from '../../../src/modules/auth/infrastructure/models/user-token.model';
import { UserToken } from '@/modules/auth/domain/entities/user-token.entity';

describe('Map any entity to its model', () => {
  test('should convert user entity to model', () => {
    const user: User = factoryUser({});

    const userModel = mapEnityOrDtoToModel<User, UserModel>(user);

    expect(userModel).toMatchObject({
      id: expect.any(String),
      email: expect.any(String),
      username: expect.any(String),
      first_name: expect.any(String),
      last_name: expect.any(String),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      status: expect.any(String),
      passwd: expect.any(String),
    });
  });

  test('should convert user token entity to model', () => {
    const userToken = factoryUserToken({});

    const userTokenModel = mapEnityOrDtoToModel<UserToken, UserTokenModel>(
      userToken,
    );

    expect(userTokenModel).toMatchObject({
      ip_addr: expect.any(String),
      id: expect.any(String),
      category: expect.any(String),
      token: expect.any(String),
      device: expect.any(String),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
  });
});
