import { Container } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import { UserController } from './interface/http/controllers/user.controller';
import { GetCurrentUserUseCase } from './application/usecases/get-current-user.usecase';
import { UpdateUserProfileUseCase } from './application/usecases/update-user-profile.usecase';
import { AddUserInteractionUseCase } from './application/usecases/add-user-interaction.usecase';
import { DeleteUserImageUseCase } from './application/usecases/delete-user-image.usecase';
import { ReorderUserImageUseCase } from './application/usecases/reorder-user-image-usecase';
import { GetAllTagsUseCase } from './application/usecases/get-all-tags.usecase';
import { FetchBestUserSuggestion } from './application/usecases/fetch-best-user-suggestion.usecase';
import { GetUserListFromIdListUseCase } from './application/usecases/get-user-list-from-id.usecase';
import { FilterUsersUseCase } from './application/usecases/filter-users.usecase';
import { ReverseGeocodeCoordinatesUseCase } from './application/usecases/reverse-geocode-coordinates.usecase';
import { GetUserImageUseCase } from './application/usecases/get-user-image.usecase';
import { UserRepository } from './application/ports/repositories/user.repository';
import { UserRepositoryDb } from './infrastructure/adapters/repositories/user-repository-db';
import { UserInterestRepository } from './application/ports/repositories/user-interest.repository';
import { UserInterestRepositoryDb } from './infrastructure/adapters/repositories/user-interest-repository-db';
import { UserInteractionRepository } from './application/ports/repositories/user-profile-interaction.repository';
import { UserInteractionRepositoryDb } from './infrastructure/adapters/repositories/user-interaction-repository-db';
import { UserImageRepository } from './application/ports/repositories/user-image.repository';
import { UserImageRepositoryDb } from './infrastructure/adapters/repositories/user-image-repository-db';
import { UserLocationRepository } from './application/ports/repositories/user-location.repository';
import { UserLocationRepositoryDb } from './infrastructure/adapters/repositories/user-location-repository-db';
import { GeocodeService } from './application/ports/services/geo-code-service';
import { GeocodeOpenStreetMap } from './infrastructure/adapters/services/geocode-openstreetmap';
import { ImageStorageService } from './application/ports/services/image-storage.service';
import { LocalDiskImageStorage } from './infrastructure/adapters/services/local-disk-image-storage';

export function bindUsersModule(container: Container) {
  container.bind(UserController).toSelf().inSingletonScope();

  container.bind(GetCurrentUserUseCase).toSelf().inSingletonScope();
  container.bind(UpdateUserProfileUseCase).toSelf().inSingletonScope();
  container.bind(AddUserInteractionUseCase).toSelf().inSingletonScope();
  container.bind(DeleteUserImageUseCase).toSelf().inSingletonScope();
  container.bind(ReorderUserImageUseCase).toSelf().inSingletonScope();
  container.bind(GetAllTagsUseCase).toSelf().inSingletonScope();
  container.bind(FetchBestUserSuggestion).toSelf().inSingletonScope();
  container.bind(GetUserListFromIdListUseCase).toSelf().inSingletonScope();
  container.bind(FilterUsersUseCase).toSelf().inSingletonScope();
  container.bind(ReverseGeocodeCoordinatesUseCase).toSelf().inSingletonScope();
  container.bind(GetUserImageUseCase).toSelf().inSingletonScope();

  container
    .bind<UserRepository>(TYPE.UserRepository)
    .to(UserRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserInterestRepository>(TYPE.UserInterestRepository)
    .to(UserInterestRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserInteractionRepository>(TYPE.UserInteractionRepository)
    .to(UserInteractionRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserImageRepository>(TYPE.UserImageRepository)
    .to(UserImageRepositoryDb)
    .inSingletonScope();

  container
    .bind<UserLocationRepository>(TYPE.UserLocationRepository)
    .to(UserLocationRepositoryDb)
    .inSingletonScope();

  container
    .bind<GeocodeService>(TYPE.GeocodeService)
    .to(GeocodeOpenStreetMap)
    .inSingletonScope();

  container
    .bind<ImageStorageService>(TYPE.ImageStorageService)
    .to(LocalDiskImageStorage)
    .inSingletonScope();
}
