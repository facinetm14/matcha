import { Container } from 'inversify';
import { GetCurrentUserUseCase } from '@/modules/users/application/usecases/get-current-user.usecase';
import { CheckUserIdentifierAvailabilityUseCase } from '@/modules/auth/application/usecases/check-user-identifier-availability.usecase';
import { RefreshAccessTokenUseCase } from '@/modules/auth/application/usecases/refresh-token.usecase';
import { ResetPasswordUseCase } from '@/modules/auth/application/usecases/reset-password.usecase';
import { ConfrimResetPasswordUseCase } from '@/modules/auth/application/usecases/confirm-reset-password.usecase';
import { CreateNewPasswordUseCase } from '@/modules/auth/application/usecases/create-new-password.usecase';
import { LogoutUseCase } from '@/modules/auth/application/usecases/logout.usecase';
import { UpdateUserProfileUseCase } from '@/modules/users/application/usecases/update-user-profile.usecase';
import { AddUserInteractionUseCase } from '@/modules/users/application/usecases/add-user-interaction.usecase';
import { DeleteUserImageUsceCase } from '@/modules/users/application/usecases/delete-user-image.usecase';
import { ReorderUserImageUseCase } from '@/modules/users/application/usecases/reorder-user-image-usecase';
import { GetAllTagsUseCase } from '@/modules/users/application/usecases/get-all-tags.usecase';
import { FetchBestUserSuggestion } from '@/modules/users/application/usecases/fetch-best-user-suggestion.usecase';
import { GetUserListFromIdListUseCase } from '@/modules/users/application/usecases/get-user-list-from-id.usecase';
import { GetUserChannelsUseCase } from '@/modules/notifications/application/usecases/get-user-channels.usecase';
import { RegisterUserUseCase } from '@/modules/auth/application/usecases/register-user.usecase';
import { LoginUserUseCase } from '@/modules/auth/application/usecases/login-user.usecase';
import { VerifyUserUseCase } from '@/modules/auth/application/usecases/verify-user.usecase';
import { SendMessageUsceCase } from '@/modules/notifications/application/usecases/send-message.usecase';

export function bindUseCases(container: Container) {
  container.bind(RegisterUserUseCase).toSelf().inSingletonScope();
  container.bind(VerifyUserUseCase).toSelf().inSingletonScope();
  container.bind(LoginUserUseCase).toSelf().inSingletonScope();
  container.bind(GetCurrentUserUseCase).toSelf().inSingletonScope();
  container
    .bind(CheckUserIdentifierAvailabilityUseCase)
    .toSelf()
    .inSingletonScope();
  container.bind(RefreshAccessTokenUseCase).toSelf().inSingletonScope();
  container.bind(ResetPasswordUseCase).toSelf().inSingletonScope();
  container.bind(ConfrimResetPasswordUseCase).toSelf().inSingletonScope();
  container.bind(CreateNewPasswordUseCase).toSelf().inSingletonScope();
  container.bind(LogoutUseCase).toSelf().inSingletonScope();
  container.bind(UpdateUserProfileUseCase).toSelf().inSingletonScope();
  container.bind(AddUserInteractionUseCase).toSelf().inSingletonScope();
  container.bind(DeleteUserImageUsceCase).toSelf().inSingletonScope();
  container.bind(ReorderUserImageUseCase).toSelf().inSingletonScope();
  container.bind(GetAllTagsUseCase).toSelf().inSingletonScope();
  container.bind(FetchBestUserSuggestion).toSelf().inSingletonScope();
  container.bind(GetUserListFromIdListUseCase).toSelf().inSingletonScope();
  container.bind(GetUserChannelsUseCase).toSelf().inSingletonScope();
  container.bind(SendMessageUsceCase).toSelf().inSingletonScope();
}
