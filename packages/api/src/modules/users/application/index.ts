// Application layer - use cases, ports, DTOs, errors, constants
export { GetCurrentUserUseCase } from './usecases/get-current-user.usecase';
export { UpdateUserProfileUseCase } from './usecases/update-user-profile.usecase';
export { AddUserInteractionUseCase } from './usecases/add-user-interaction.usecase';
export type { AddUserInteractionError } from './usecases/add-user-interaction.usecase';
export { DeleteUserImageUsceCase } from './usecases/delete-user-image.usecase';
export { ReorderUserImageUseCase } from './usecases/reorder-user-image-usecase';
export { GetAllTagsUseCase } from './usecases/get-all-tags.usecase';
export { FetchBestUserSuggestion } from './usecases/fetch-best-user-suggestion.usecase';
export { GetUserListFromIdListUseCase } from './usecases/get-user-list-from-id.usecase';
export { FilterUsersUseCase } from './usecases/filter-users.usecase';

// Ports
export type { UserRepository } from './ports/repositories/user.repository';
export type { UserInterestRepository } from './ports/repositories/user-interest.repository';
export type { UserInteractionRepository } from './ports/repositories/user-profile-interaction.repository';
export type { UserImageRepository } from './ports/repositories/user-image.repository';
export type { UserLocationRepository } from './ports/repositories/user-location.repository';
export type { GeocodeService } from './ports/services/geo-code-service';

// DTOs
export type { FilterUsersDto } from './dto/filter-users.dto';
export type { UpdateUserProfileDto } from './dto/update-user-profile.dto';
export type { CreateInteractionDto } from './dto/create-user-interaction.dto';
export type { DeleteUserImageDto } from './dto/delete-user-image.dto';
export type { UploadImageDto } from './dto/upload-image.dto';
export type { GetUserProfileListDto } from './dto/get-user-profile-list.dto';
export type { CheckUserIdentifierAvailabilityDto } from './dto/check-user-identifier-availabilty.dto';
export type { CreateUserLocationDto } from './dto/create-user-location-dto';

// Errors
export { UpdateUserProfileError } from './errors/update-user-profile.error';

// Constants
export { UserUniqKeys } from './consts/user-uniq-keys.enum';
export { UserStatus } from '../domain/consts/user-status.enum';
export { DEFAULT_SEXUAL_ORIENTATION } from './consts/default-sexual-orientation';
export { UPLOAD_DEST } from './consts/upload-dest';
export { AcceptedMimeType } from './consts/accepted-mimetype';
export { UserInterestColumns } from './consts/user-interest-columns.enum';
