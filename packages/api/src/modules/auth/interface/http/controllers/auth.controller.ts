import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/usecases/register-user.usecase';
import { uuid } from '@shared/uuid';
import { RegisterUserError } from '../../../application/errors/register-user.error';
import { Logger } from '@/modules/shared/application/ports/services/logger.service';
import { VerifyUserUseCase } from '../../../application/usecases/verify-user.usecase';
import { UserTokenCateory } from '../../../domain/consts/user-token-category';
import { LoginUserUseCase } from '../../../application/usecases/login-user.usecase';
import { LoginUserError } from '../../../application/errors/login-user.error';
import { factoryUserToken } from '@/modules/shared/application/utils/factory';
import { RefreshAccessTokenUseCase } from '@/modules/auth/application/usecases/refresh-token.usecase';
import { VerifyTokenError } from '@/modules/auth/application/errors/verify-token.error';
import { ResetPasswordUseCase } from '@/modules/auth/application/usecases/reset-password.usecase';
import { ResetPasswordError } from '@/modules/auth/application/errors/reset-password.error';
import { ConfrimResetPasswordUseCase } from '@/modules/auth/application/usecases/confirm-reset-password.usecase';
import { CreateNewPasswordUseCase } from '@/modules/auth/application/usecases/create-new-password.usecase';
import { CreateNewPasswordError } from '@/modules/auth/application/errors/create-new-password.error';
import {
  attachTokensToSecureCookies,
  clearSessionCookies,
} from '../middlewares/attach-secure-cookies';
import { getConnectedUserId } from '../middlewares/get-connected-user';
import { AccessTokenService } from '@/modules/auth/application/ports/services/access-token.service';
import { LogoutUseCase } from '@/modules/auth/application/usecases/logout.usecase';
import { TYPE } from '@/config/ioc/inversify-type';
import { CreateUserDtoSchema } from '../../validations/create-user-dto.validation';
import { LoginUserDtoSchema } from '../../validations/login-user-dto.validation';
import { RefreshTokenDtoSchema } from '../../validations/refresh-token-dto.validation';
import { CreateResetPasswordLinkDtoSchema } from '../../validations/create-reset-password-link-dto.validation';
import { CreateNewPasswordDtoSchema } from '../../validations/create-new-password-dto.validation';

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
    @inject(TYPE.AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
    @inject(LogoutUseCase) private readonly logoutUseCase: LogoutUseCase,
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

    resp.status(201).json(registerUserResult.data);
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

    const { token, refresh } = loginUserResult.data;

    attachTokensToSecureCookies(resp, { token, refresh });

    resp.status(200).json({ token, refresh });
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

    resp.status(201).json(refreshTokenResult.data);
  }

  async resetPassword(req: Request, resp: Response) {
    const parsedBody = CreateResetPasswordLinkDtoSchema.safeParse(req.body);

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

      resp.status(500).json('server internal error, please try later!');
      return;
    }

    resp.status(200).json(resetPasswordResult.data);
  }

  async confirmResetPassword(req: Request, resp: Response) {
    const { validationToken } = req.params;

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

    const accessToken = confrimResetPasswordResult.data;
    attachTokensToSecureCookies(resp, { token: accessToken.token });

    resp.status(200).json(accessToken);
  }

  async createNewPassword(req: Request, resp: Response) {
    const parsedBody = CreateNewPasswordDtoSchema.safeParse(req.body);

    if (!parsedBody.success) {
      resp.status(400).send('bad request');
      return;
    }

    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('invalid token');
      return;
    }

    const createNewPasswordDto = parsedBody.data;
    const createNewPasswordResult = await this.createNewPasswordUseCase.execute(
      createNewPasswordDto,
      connectedUserResult.data,
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
      case CreateNewPasswordError.USER_NOT_FOUND:
        return resp.status(404).send('user not found');
      case CreateNewPasswordError.WEAK_PASSWORD:
        return resp.status(400).send('weak password');
      default:
        return resp.status(500).send('unknown error, please retry later');
    }
  }

  async logout(req: Request, resp: Response) {
    const refresh = req.cookies.refresh ?? req.refresh;
    await this.logoutUseCase.execute(refresh);

    clearSessionCookies(resp);
    resp.status(200).send('successfully logged out');
  }
}
