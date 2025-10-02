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
import { UserTokenCateory } from '../../../core/domain/enums/user-token-category';
import { LoginUserUseCase } from '../../../core/usecases/auth/login-user.usecase';
import { LoginUserDtoSchema } from '../../../core/domain/dto/login-user.dto';
import { LoginUserError } from '../../../core/domain/errors/login-user.error';
import { RefreshTokenDtoSchema } from '@/core/domain/dto/refresh-token.dto';
import { factoryUserToken } from '@shared/factory';
import { RefreshAccessTokenUseCase } from '@/core/usecases/auth/refresh-token.usecase';
import { VerifyTokenError } from '@/core/domain/errors/verify-token.error';
import { ResetPasswordDtoSchema } from '@/core/domain/dto/reset-password.dto';
import { ResetPasswordUseCase } from '@/core/usecases/auth/reset-password.usecase';
import { ResetPasswordError } from '@/core/domain/errors/reset-password.error';
import { ConfrimResetPasswordUseCase } from '@/core/usecases/auth/confirm-reset-password.usecase';
import { CreateNewPasswordDtoSchema } from '@/core/domain/dto/create-new-password.dto';
import { CreateNewPasswordUseCase } from '@/core/usecases/auth/create-new-password.usecase';
import { CreateNewPasswordError } from '@/core/domain/errors/create-new-password.error';

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
    @inject(RefreshAccessTokenUseCase)
    private readonly refreshTokenUseCase: RefreshAccessTokenUseCase,
    @inject(ResetPasswordUseCase)
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    @inject(ConfrimResetPasswordUseCase)
    private readonly confirmResetPasswordUseCase: ConfrimResetPasswordUseCase,
    @inject(CreateNewPasswordUseCase)
    private readonly createNewPasswordUseCase: CreateNewPasswordUseCase,
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

    const userToken = factoryUserToken({
      userId: createUserDto.id,
      category: UserTokenCateory.ONE_TIME,
      expireAt: null,
      ipAddr,
      device,
      createdAt: now,
      updatedAt: now,
    });

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

    const activateUserAccountResult =
      await this.verifyUserUseCase.execute(validationToken);

    if (activateUserAccountResult.isErr) {
      resp.status(401).send('invalid token');
      return;
    }

    resp.status(200).send('user email successfully verified');
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

  async refreshToken(req: Request, resp: Response) {
    const parsedBody = RefreshTokenDtoSchema.safeParse(req.body);

    if (!parsedBody.success) {
      resp.status(400).send('Bad request');
      return;
    }

    const refreshTokenDto = parsedBody.data;
    const device = `${JSON.stringify(req.headers['user-agent'])}`;
    const ipAddr = `${req.ip}`;

    const refreshTokenResult = await this.refreshTokenUseCase.execute(
      refreshTokenDto.refreshToken,
      ipAddr,
      device,
    );

    if (refreshTokenResult.isErr) {
      const error = refreshTokenResult.error;
      if (error === VerifyTokenError.UNKNOWN_CLIENT) {
        resp.status(403).send('Unknown client');
        return;
      }
      resp.status(401).send('Invalid token');
      return;
    }

    resp.status(201).send(refreshTokenResult.data);
  }

  async resetPassword(req: Request, resp: Response) {
    const parsedBody = ResetPasswordDtoSchema.safeParse(req.body);

    if (!parsedBody.success) {
      resp.status(400).send('bad request');
      return;
    }

    const { email } = parsedBody.data;
    const resetPasswordResult = await this.resetPasswordUseCase.execute(email);
    if (resetPasswordResult.isErr) {
      const error = resetPasswordResult.error;

      if (error === ResetPasswordError.USER_NOT_FOUND) {
        resp.status(404).send(`no user found with ${email}`);
        return;
      }

      resp.status(500).send('server internal error, please try later!');
      return;
    }

    resp.status(200).send(resetPasswordResult.data);
  }

  async confirmResetPassword(req: Request, resp: Response) {
    const { validationToken } = req.body;

    if (!validationToken) {
      resp.status(400).send('baq request');
      return;
    }

    const device = `${JSON.stringify(req.headers['user-agent'])}`;
    const ipAddr = `${req.ip}`;

    const confrimResetPasswordResult =
      await this.confirmResetPasswordUseCase.execute(
        validationToken,
        ipAddr,
        device,
      );

    if (confrimResetPasswordResult.isErr) {
      resp.status(401).send('invalid token');
      return;
    }

    resp.status(200).send(confrimResetPasswordResult.data);
  }

  async createNewPassword(req: Request, resp: Response) {
    const parsedBody = CreateNewPasswordDtoSchema.safeParse(req.body);

    if (!parsedBody.success) {
      resp.status(400).send('bad request');
      return;
    }

    const createNewPasswordDto = parsedBody.data;
    const accessToken = req.token!;

    const createNewPasswordResult = await this.createNewPasswordUseCase.execute(
      createNewPasswordDto,
      accessToken,
    );

    if (createNewPasswordResult.isErr) {
      const error = createNewPasswordResult.error;
      this.handleCreateNewPasswordError(error, resp);
      return;
    }

    resp.status(200).send('password successfully updated!');
  }

  private handleCreateNewPasswordError(
    error: CreateNewPasswordError,
    resp: Response,
  ): Response {
    switch (error) {
      case CreateNewPasswordError.MIS_MATCH_PASSWORD:
        return resp.status(400).send('mismatch password and confirm password');
      case CreateNewPasswordError.INVALID_TOKEN:
        return resp.status(401).send('invalid token');
      case CreateNewPasswordError.EXPIRED_TOKEN:
        return resp
          .status(401)
          .send('expired token, please refresh your token');
      case CreateNewPasswordError.USER_NOT_FOUND:
        return resp.status(404).send('user not found');
      case CreateNewPasswordError.WEAK_PASSWORD:
        return resp.status(400).send('weak password');
      default:
        return resp.status(500).send('unknown error, please retry later');
    }
  }
}
