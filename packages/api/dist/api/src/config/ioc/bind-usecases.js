"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindUseCases = bindUseCases;
const get_current_user_usecase_1 = require("../../modules/users/application/usecases/get-current-user.usecase");
const check_user_identifier_availability_usecase_1 = require("../../modules/auth/application/usecases/check-user-identifier-availability.usecase");
const refresh_token_usecase_1 = require("../../modules/auth/application/usecases/refresh-token.usecase");
const reset_password_usecase_1 = require("../../modules/auth/application/usecases/reset-password.usecase");
const confirm_reset_password_usecase_1 = require("../../modules/auth/application/usecases/confirm-reset-password.usecase");
const create_new_password_usecase_1 = require("../../modules/auth/application/usecases/create-new-password.usecase");
const logout_usecase_1 = require("../../modules/auth/application/usecases/logout.usecase");
const update_user_profile_usecase_1 = require("../../modules/users/application/usecases/update-user-profile.usecase");
const add_user_interaction_usecase_1 = require("../../modules/users/application/usecases/add-user-interaction.usecase");
const delete_user_image_usecase_1 = require("../../modules/users/application/usecases/delete-user-image.usecase");
const reorder_user_image_usecase_1 = require("../../modules/users/application/usecases/reorder-user-image-usecase");
const get_all_tags_usecase_1 = require("../../modules/users/application/usecases/get-all-tags.usecase");
const fetch_best_user_suggestion_usecase_1 = require("../../modules/users/application/usecases/fetch-best-user-suggestion.usecase");
const get_user_list_from_id_usecase_1 = require("../../modules/users/application/usecases/get-user-list-from-id.usecase");
const get_user_channels_usecase_1 = require("../../modules/notifications/application/usecases/get-user-channels.usecase");
const register_user_usecase_1 = require("../../modules/auth/application/usecases/register-user.usecase");
const login_user_usecase_1 = require("../../modules/auth/application/usecases/login-user.usecase");
const verify_user_usecase_1 = require("../../modules/auth/application/usecases/verify-user.usecase");
const send_message_usecase_1 = require("../../modules/notifications/application/usecases/send-message.usecase");
const filter_users_usecase_1 = require("../../modules/users/application/usecases/filter-users.usecase");
function bindUseCases(container) {
    container.bind(register_user_usecase_1.RegisterUserUseCase).toSelf().inSingletonScope();
    container.bind(verify_user_usecase_1.VerifyUserUseCase).toSelf().inSingletonScope();
    container.bind(login_user_usecase_1.LoginUserUseCase).toSelf().inSingletonScope();
    container.bind(get_current_user_usecase_1.GetCurrentUserUseCase).toSelf().inSingletonScope();
    container
        .bind(check_user_identifier_availability_usecase_1.CheckUserIdentifierAvailabilityUseCase)
        .toSelf()
        .inSingletonScope();
    container.bind(refresh_token_usecase_1.RefreshAccessTokenUseCase).toSelf().inSingletonScope();
    container.bind(reset_password_usecase_1.ResetPasswordUseCase).toSelf().inSingletonScope();
    container.bind(confirm_reset_password_usecase_1.ConfrimResetPasswordUseCase).toSelf().inSingletonScope();
    container.bind(create_new_password_usecase_1.CreateNewPasswordUseCase).toSelf().inSingletonScope();
    container.bind(logout_usecase_1.LogoutUseCase).toSelf().inSingletonScope();
    container.bind(update_user_profile_usecase_1.UpdateUserProfileUseCase).toSelf().inSingletonScope();
    container.bind(add_user_interaction_usecase_1.AddUserInteractionUseCase).toSelf().inSingletonScope();
    container.bind(delete_user_image_usecase_1.DeleteUserImageUsceCase).toSelf().inSingletonScope();
    container.bind(reorder_user_image_usecase_1.ReorderUserImageUseCase).toSelf().inSingletonScope();
    container.bind(get_all_tags_usecase_1.GetAllTagsUseCase).toSelf().inSingletonScope();
    container.bind(fetch_best_user_suggestion_usecase_1.FetchBestUserSuggestion).toSelf().inSingletonScope();
    container.bind(get_user_list_from_id_usecase_1.GetUserListFromIdListUseCase).toSelf().inSingletonScope();
    container.bind(get_user_channels_usecase_1.GetUserChannelsUseCase).toSelf().inSingletonScope();
    container.bind(send_message_usecase_1.SendMessageUsceCase).toSelf().inSingletonScope();
    container.bind(filter_users_usecase_1.FilterUsersUseCase).toSelf().inSingletonScope();
}
