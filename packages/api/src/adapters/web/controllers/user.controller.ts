import { CheckUserIdentifierAvailabilityDtoSchema } from '@/core/domain/dto/check-user-identifier-availability.dto';
import { UserUniqKeys } from '@/core/domain/enums/user-uniq-keys.enum';
import { VerifyTokenError } from '@/core/domain/errors/verify-token.error';
import { CheckUserIdentifierAvailabilityUseCase } from '@/core/usecases/auth/check-user-identifier-availability.usecase';
import { GetCurrentUserUseCase } from '@/core/usecases/users/get-current-user.usecase';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class UserController {
  constructor(
    @inject(GetCurrentUserUseCase)
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    @inject(CheckUserIdentifierAvailabilityUseCase)
    private readonly CheckUserIdentifierAvailabilityUseCase: CheckUserIdentifierAvailabilityUseCase,
  ) {}

  async getMe(req: Request, resp: Response) {
    const accessToken = req.token!;
    const getCurrentUserResult = await this.getCurrentUserUseCase.execute(
      accessToken
    );

    if (getCurrentUserResult.isErr) {
      const error = getCurrentUserResult.error;
      if (error === VerifyTokenError.INVALID_TOKEN) {
        resp.status(401).send('Invalid token');
        return;
      }
      resp.status(404).send('User not found');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwd, ...user } = getCurrentUserResult.data;

    resp.status(200).send(user);
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

    resp.status(200).send({ available: isUserIdentifierAvailable });
  }
}
