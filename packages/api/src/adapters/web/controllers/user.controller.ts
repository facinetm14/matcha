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
import { CreateInteractionDtoSchema } from '@/core/domain/dto/create-interaction.dto';
import {
  AddUserInteractionError,
  AddUserInteractionUseCase,
} from '@/core/usecases/users/add-user-interaction.usecase';

import { createReadStream, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { UPLOAD_DEST } from '@/core/domain/consts/upload-dest';
import { AcceptedMimeType } from '@/core/domain/consts/accepted-mimetype';
import { extractFileExtension } from '@shared/extract-file-extension';
import { DeleteUserImageDtoSchema } from '@/core/domain/dto/delete-user-image.dto';
import { DeleteUserImageUsceCase } from '@/core/usecases/users/delete-user-image.usecase';
import { ReorderImagesDtoSchema } from '@/core/domain/dto/reorder-images.dto';
import { ReorderUserImageUseCase } from '@/core/usecases/users/reorder-user-image-usecase';

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
    @inject(AddUserInteractionUseCase)
    private readonly addUserInteractionUseCase: AddUserInteractionUseCase,
    @inject(DeleteUserImageUsceCase)
    private readonly deleteImageUseCase: DeleteUserImageUsceCase,
    @inject(ReorderUserImageUseCase)
    private readonly reorderUserImageUseCase: ReorderUserImageUseCase,
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

      this.handleUpdateUserProfileInfosError(error, resp);
      return;
    }

    resp.status(200).send('updated user successfully');
  }

  private handleUpdateUserProfileInfosError(
    error: UpdateUserProfileError,
    resp: Response,
  ): Response {
    switch (error) {
      case UpdateUserProfileError.USER_NOT_FOUND:
        return resp.status(404).send('user not found');
      case UpdateUserProfileError.USERNAME_ALREADY_EXISTS:
        return resp.status(409).send('username already used');
      case UpdateUserProfileError.EMAIL_AREDAY_EXISTS:
        return resp.status(409).send('email already used');
      default:
        return resp
          .status(500)
          .send('server internal error, please retry later');
    }
  }

  async addUserInteraction(req: Request, resp: Response) {
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
    const parsedBody = CreateInteractionDtoSchema.safeParse(req.body);
    if (!parsedBody.success) {
      resp.status(400).send('Bad request');
      return;
    }

    const addInteractionResult = await this.addUserInteractionUseCase.execute(
      parsedBody.data,
      userId,
    );

    if (addInteractionResult.isErr) {
      const error = addInteractionResult.error;
      this.handleAddUserInteractionError(error, resp);
      return;
    }

    resp.status(201).send('user interaction sucessfully added');
  }

  private handleAddUserInteractionError(
    error: AddUserInteractionError,
    resp: Response,
  ): Response {
    switch (error) {
      case 'author_not_found':
      case 'recipient_not_found':
        return resp.status(404).send('user not found');
      case 'unauthorized':
        return resp.status(401).send('unauthorized');
      case 'unknow_error':
        return resp
          .status(500)
          .send('server internal error, please retry later');
    }
  }

  async getImage(req: Request, resp: Response) {
    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('Invalid token');
      return;
    }

    const { filename } = req.params;

    if (!filename) {
      resp.status(400).send('bad request');
      return;
    }

    const path = join(process.cwd(), UPLOAD_DEST, filename);
    if (!existsSync(path)) {
      resp.status(404).send('image not found');
      return;
    }

    const fileStream = createReadStream(path);
    const type = AcceptedMimeType.get(extractFileExtension(path));

    if (!type) {
      resp.status(400).send('wrong extension');
      return;
    }

    resp.writeHead(200, {
      'Content-Type': `image/${type}`,
      'Content-Length': statSync(path).size,
      'Cross-Origin-Resource-Policy': 'same-site | same-origin | cross-origin',
    });

    fileStream.pipe(resp);
  }

  async deleteImages(req: Request, resp: Response) {
    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('Invalid token');
      return;
    }

    const parsedBody = DeleteUserImageDtoSchema.safeParse(req.body);

    if (!parsedBody.success) {
      resp.status(400).send('bad request');
      return;
    }

    const userId = connectedUserResult.data;
    const imageListToDelete = parsedBody.data.images;

    await this.deleteImageUseCase.execute(userId, imageListToDelete);
    resp.status(200).send('image sucessfully deleted');
  }

  async reorderImages(req: Request, resp: Response) {
    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('Invalid token');
      return;
    }

    const parsedBody = ReorderImagesDtoSchema.safeParse(req.body);

    if (!parsedBody.success) {
      resp.status(400).send('bad request');
      return;
    }

    const userId = connectedUserResult.data;
    const newImagePositions = parsedBody.data.images;

    await this.reorderUserImageUseCase.execute(userId, newImagePositions);
    resp.status(200).send('image sucessfully reordered');
  }
}
