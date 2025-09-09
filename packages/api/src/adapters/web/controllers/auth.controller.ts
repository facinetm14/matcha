import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { CreateUserDtoSchema } from '../../../core/domain/dto/create-user.dto';
import { RegisterUserUseCase } from '../../../core/usecases/auth/register-user.usecase';
import { uuid } from '../../../../../shared/uuid';
import { RegisterUserError } from '../../../core/domain/errors/register-user.error';
import { baseApi } from '../consts/base.api';
import { Logger } from '../../../core/ports/services/logger.service';
import { TYPE } from '../../../infrastructure/config/inversify-type';

@injectable()
export class AuthController {
  constructor(
    @inject(RegisterUserUseCase)
    private readonly registerUserUseCase: RegisterUserUseCase,
    @inject(TYPE.Logger)
    private readonly logger: Logger,
  ) {}

  async registerUser(req: Request, resp: Response) {
    const start = performance.now();

    const parsedBody = CreateUserDtoSchema.safeParse(req.body);

    if (!parsedBody.success) {
      resp.status(400).send('Bad request');
      return;
    }

    const createUserDto = { ...parsedBody.data, id: uuid() };

    const registerUserResult =
      await this.registerUserUseCase.execute(createUserDto);
    if (registerUserResult.isErr) {
      const error = registerUserResult.error;
      this.handleRegisterUserError(error, resp);
      return;
    }

    resp.status(201).send('user registered successfully');
    const duration = performance.now() - start;
    this.logger.info(
      `${baseApi}/auth/register - [201] - [${Math.ceil(duration)} ms]`,
    );
  }

  private handleRegisterUserError(
    error: RegisterUserError,
    resp: Response,
  ): Response {
    switch (error) {
      case RegisterUserError.EMAIL_ALREADY_EXISTS:
      case RegisterUserError.USER_NAME_ALREADY_EXISTS:
        return resp.status(409).send(error);

      case RegisterUserError.UNKNOWN_ERROR:
        return resp.status(500).send(error);
      default:
        return resp.status(400).send(error);
    }
  }
}
