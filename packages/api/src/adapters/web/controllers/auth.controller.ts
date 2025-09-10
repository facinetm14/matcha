import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { CreateUserDtoSchema } from '../../../core/domain/dto/create-user.dto';
import { RegisterUserUseCase } from '../../../core/usecases/auth/register-user.usecase';
import { uuid } from '../../../../../shared/uuid';
import { RegisterUserError } from '../../../core/domain/errors/register-user.error';
import { baseApi } from '../consts/base.api';
import { Logger } from '../../../core/ports/services/logger.service';
import { TYPE } from '../../../infrastructure/config/inversify-type';
import { VerifyUserUseCase } from '../../../core/usecases/auth/verify-user.usecase';
import { UserToken } from '../../../core/domain/entities/user-token.entity';
import { UserTokenCateory } from '../../../core/domain/enums/user-token-category';
import { LoginUserUseCase } from '../../../core/usecases/auth/login-user.usecase';
import { LoginUserDtoSchema } from '../../../core/domain/dto/login-user.dto';
import { LoginUserError } from '../../../core/domain/errors/login-user.error';

@injectable()
export class AuthController {
  constructor(
    @inject(RegisterUserUseCase)
    private readonly registerUserUseCase: RegisterUserUseCase,
    @inject(TYPE.Logger)
    private readonly logger: Logger,
    @inject(VerifyUserUseCase)
    private readonly verifyUserUseCase: VerifyUserUseCase,
    @inject(LoginUserUseCase)
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  async registerUser(req: Request, resp: Response) {
    const parsedBody = CreateUserDtoSchema.safeParse(req.body);

    if (!parsedBody.success) {
      resp.status(400).send('Bad request');
      return;
    }

    const createUserDto = { ...parsedBody.data, id: uuid() };
    const device = `${JSON.stringify(req.headers['user-agent'])}`;
    const ipAddr = `${req.ip}`;

    const now = new Date();

    console.log({ device: JSON.parse(device), ipAddr });

    const userToken: UserToken = {
      id: uuid(),
      token: uuid(),
      userId: createUserDto.id,
      category: UserTokenCateory.ONE_TIME,
      expireAt: null,
      ipAddr,
      device,
      createdAt: now,
      updatedAt: now,
    };

    const registerUserResult = await this.registerUserUseCase.execute(
      createUserDto,
      userToken,
    );

    if (registerUserResult.isErr) {
      const error = registerUserResult.error;
      this.handleRegisterUserError(error, resp);
      return;
    }

    resp.status(201).send(registerUserResult.data);
    this.logger.info(`${baseApi}/auth/register - [201]`);
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

  async verifyUserEmail(req: Request, resp: Response) {
    const { validationToken } = req.params;

    if (!validationToken) {
      resp.status(400).send('bad request');
      return;
    }

    // const activateUserAccountResult =
      await this.verifyUserUseCase.execute(validationToken);
  }

  private handleLoginUserError(
    error: LoginUserError,
    resp: Response,
  ): Response {
    switch (error) {
      case LoginUserError.USER_UNVERIFIED:
        return resp.status(403).send('user not verified');
      default:
        return resp.status(401).send('invalid credentials');
    }
  }

  async loginUser(req: Request, resp: Response) {
    const parsedBody = LoginUserDtoSchema.safeParse(req.body);

    if (!parsedBody.success) {
      resp.status(400).send('Bad request');
      return;
    }

    const loginUserDto = parsedBody.data;
    const device = `${JSON.stringify(req.headers['user-agent'])}`;
    const ipAddr = `${req.ip}`;

    const loginUserResult = await this.loginUserUseCase.execute(
      loginUserDto,
      device,
      ipAddr,
    );

    if (loginUserResult.isErr) {
      const error = loginUserResult.error;
      this.handleLoginUserError(error, resp);
      return;
    }

    resp.status(200).send(loginUserResult.data);
  }
}
