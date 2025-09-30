import { VerifyTokenError } from '@/core/domain/errors/verify-token.error';
import { GetCurrentUserUseCase } from '@/core/usecases/users/get-current-user.usecase';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class UserController {
  constructor(
    @inject(GetCurrentUserUseCase)
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  async getMe(req: Request, resp: Response) {
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      resp.status(401).send('Unauthorized');
      return;
    }

    const getCurrentUserResult =
      await this.getCurrentUserUseCase.execute(accessToken);

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
}
