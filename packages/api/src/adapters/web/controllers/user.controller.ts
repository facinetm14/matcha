import { CheckUserIdentifierAvailabilityDtoSchema } from '@/core/domain/dto/check-user-identifier-availability.dto';
import { UserUniqKeys } from '@/core/domain/enums/user-uniq-keys.enum';
import { CheckUserIdentifierAvailabilityUseCase } from '@/core/usecases/auth/check-user-identifier-availability.usecase';
import { GetCurrentUserUseCase } from '@/core/usecases/users/get-current-user.usecase';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { getConnectedUserId } from '../middlewares/get-connected-user';
import { AccessTokenService } from '@/core/ports/services/access-token.service';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { UpdateUserProfileDtoSchema } from '@/core/domain/dto/update-user-profile.dto';
import { UpdateUserProfileUseCase } from '@/core/usecases/users/update-user-profile.usecase';
import { UpdateUserProfileError } from '@/core/domain/errors/update-user-profile.error';

@injectable()
export class UserController {
  constructor(
    @inject(GetCurrentUserUseCase)
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    @inject(CheckUserIdentifierAvailabilityUseCase)
    private readonly CheckUserIdentifierAvailabilityUseCase: CheckUserIdentifierAvailabilityUseCase,
    @inject(TYPE.AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
    @inject(UpdateUserProfileUseCase)
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
  ) {}

  async getMe(req: Request, resp: Response) {
    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('Invalid token');
      return;
    }

    const getCurrentUserResult = await this.getCurrentUserUseCase.execute(
      connectedUserResult.data,
    );

    if (getCurrentUserResult.isErr) {
      resp.status(404).send('User not found');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwd, ...user } = getCurrentUserResult.data;

    resp.status(200).json(user);
  }

  async checkUserIdentifierAvailability(req: Request, resp: Response) {
    const parsedBody = CheckUserIdentifierAvailabilityDtoSchema.safeParse(
      req.body,
    );

    if (!parsedBody.success) {
      resp.status(400).send('Bad request');
      return;
    }

    const { field, value } = parsedBody.data;
    const isUserIdentifierAvailable =
      await this.CheckUserIdentifierAvailabilityUseCase.execute(
        field as unknown as UserUniqKeys,
        value,
      );

    resp.status(200).json({ available: isUserIdentifierAvailable });
  }

  async updateUserProfile(req: Request, resp: Response) {
    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('Invalid token');
      return;
    }
    const userId = connectedUserResult.data;

    const parsedBody = UpdateUserProfileDtoSchema.safeParse(req.body);

    if (!parsedBody.success) {
      resp.status(400).send('Bad request');
      return;
    }
    const updateUserProfileDto = parsedBody.data;
    const updateUserProfileResult = await this.updateUserProfileUseCase.execute(
      userId,
      updateUserProfileDto,
    );

    if (updateUserProfileResult.isErr) {
      const error = updateUserProfileResult.error;

      if (error === UpdateUserProfileError.USER_NOT_FOUND) {
        resp.status(404).send('user not found');
        return;
      }

      resp.status(500).send('server internal error, please retry later');
      return;
    }

    resp.status(200).send('updated user successfully');
  }
}
