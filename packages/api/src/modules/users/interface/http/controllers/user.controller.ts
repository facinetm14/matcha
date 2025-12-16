import { UserUniqKeys } from '@/modules/users/application/consts/user-uniq-keys.enum';
import { CheckUserIdentifierAvailabilityUseCase } from '@/modules/auth/application/usecases/check-user-identifier-availability.usecase';
import { GetCurrentUserUseCase } from '@/modules/users/application/usecases/get-current-user.usecase';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { getConnectedUserId } from '../../../../auth/interface/http/middlewares/get-connected-user';
import { AccessTokenService } from '@/modules/auth/application/ports/services/access-token.service';
import { UpdateUserProfileUseCase } from '@/modules/users/application/usecases/update-user-profile.usecase';
import { UpdateUserProfileError } from '@/modules/users/application/errors/update-user-profile.error';
import {
  AddUserInteractionError,
  AddUserInteractionUseCase,
} from '@/modules/users/application/usecases/add-user-interaction.usecase';

import { createReadStream, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { UPLOAD_DEST } from '@/modules/users/application/consts/upload-dest';
import { AcceptedMimeType } from '@/modules/users/application/consts/accepted-mimetype';
import { extractFileExtension } from '@shared/extract-file-extension';
import { DeleteUserImageUsceCase } from '@/modules/users/application/usecases/delete-user-image.usecase';
import { ReorderUserImageUseCase } from '@/modules/users/application/usecases/reorder-user-image-usecase';
import { GetAllTagsUseCase } from '@/modules/users/application/usecases/get-all-tags.usecase';
import { FetchBestUserSuggestion } from '@/modules/users/application/usecases/fetch-best-user-suggestion.usecase';
import { GetUserListFromIdListUseCase } from '@/modules/users/application/usecases/get-user-list-from-id.usecase';
import { TYPE } from '@/config/ioc/inversify-type';
import { CheckUserIdentifierAvailabilityDtoSchema } from '../../validations/check-user-identifier-availability-dto.validation';
import { GetUserProfileListSchema } from '../../validations/get-user-profile-list-dto.validation';
import { UpdateUserProfileDtoSchema } from '../../validations/update-user-profile-dto.validation';
import { DeleteUserImageDtoSchema } from '../../validations/delete-user-image-dto.validation';
import { ReorderImagesDtoSchema } from '../../validations/reorder-images-dto.validations';
import { CreateInteractionDtoSchema } from '../../validations/create-user-interaction-dto.validation';
import { UpdateUserProfileDto } from '@/modules/users/application/dto/update-user-profile.dto';
import { FilterUsersDtoSchema } from '../../validations/filter-users-dto.validation';
import { FilterUsersUseCase } from '@/modules/users/application/usecases/filter-users.usecase';
import { VerifyTokenError } from '@/modules/auth/application/errors/verify-token.error';

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
    @inject(GetAllTagsUseCase)
    private readonly getAllTagsUseCase: GetAllTagsUseCase,
    @inject(FetchBestUserSuggestion)
    private readonly fetchBestUserSuggestion: FetchBestUserSuggestion,
    @inject(GetUserListFromIdListUseCase)
    private readonly getUserListFromIdListUseCase: GetUserListFromIdListUseCase,
    @inject(FilterUsersUseCase)
    private readonly filterUsersUseCase: FilterUsersUseCase,
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

    const { passwd: _passwd, ...safeUser } = getCurrentUserResult.data;

    resp.status(200).json(safeUser);
  }

  async filterUsers(req: Request, resp: Response) {
    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('Invalid token');
      return;
    }
    const parsedBody = FilterUsersDtoSchema.safeParse(req.body);
    if (!parsedBody.success) {
      resp.status(400).send('Bad request');
      return;
    }

    const filteredUsers = await this.filterUsersUseCase.execute(
      parsedBody.data,
      connectedUserResult.data,
    );

    const safeUserList = filteredUsers.map((user) => {
      const { passwd: _passwd, email: _email, ...safeUser } = user;
      return { ...safeUser, blocked: [] };
    });

    resp.status(200).send(safeUserList);
  }

  async viewUserProfile(
    req: Request,
    resp: Response,
    { isViewing }: { isViewing: boolean } = { isViewing: false },
  ) {
    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('Invalid token');
      return;
    }

    const { id } = req.params;

    const getCurrentUserResult = await this.getCurrentUserUseCase.execute(
      connectedUserResult.data,
      id,
      isViewing,
    );

    if (getCurrentUserResult.isErr) {
      const error = getCurrentUserResult.error;

      if (error === VerifyTokenError.FORBIDDEN) {
        resp.status(403).send('Forbidden');
        return;
      }

      resp.status(404).send('User not found');
      return;
    }

    const {
      passwd: _passwd,
      email: _email,
      ...safeUser
    } = getCurrentUserResult.data;

    resp.status(200).json(safeUser);
  }

  async viewUserProfileList(req: Request, resp: Response) {
    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('Invalid token');
      return;
    }

    const parsedBody = GetUserProfileListSchema.safeParse(req.body);

    if (!parsedBody.success) {
      resp.status(400).send('Bad request');
      return;
    }

    const userIdList = parsedBody.data.userIdList;

    const userList =
      await this.getUserListFromIdListUseCase.execute(userIdList);

    const safeUserList = userList.map((user) => {
      const { email: _email, ...safeUser } = user;
      return { ...safeUser, blocked: [] };
    });

    resp.status(200).send(safeUserList);
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

    const updateUserProfileDto: UpdateUserProfileDto = {
      ...parsedBody.data,
    };

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

  async findAllInterests(req: Request, resp: Response) {
    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('Invalid token');
      return;
    }

    const interestList = await this.getAllTagsUseCase.execute();

    resp.status(200).send({ interestList });
  }

  async browse(req: Request, resp: Response) {
    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('Invalid token');
      return;
    }

    const bestUserSuggestion = await this.fetchBestUserSuggestion.execute(
      connectedUserResult.data,
    );

    if (!bestUserSuggestion) {
      resp.status(204).send('no profile to show');
      return;
    }

    resp.status(200).json(bestUserSuggestion);
  }

  async geoGode(req: Request, resp: Response) {
    const { lat, lng } = req.query as { lat?: string; lng?: string };

    const result = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'matcha-app',
        },
      },
    );

    if (!result.ok) {
      resp.status(500).send('Reverse geocoding failed');
      return;
    }

    const data = await result.json();

    resp.status(200).send(data);
  }
}
