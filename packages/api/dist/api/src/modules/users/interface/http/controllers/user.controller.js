"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const check_user_identifier_availability_usecase_1 = require("../../../../../modules/auth/application/usecases/check-user-identifier-availability.usecase");
const get_current_user_usecase_1 = require("../../../../../modules/users/application/usecases/get-current-user.usecase");
const inversify_1 = require("inversify");
const get_connected_user_1 = require("../../../../auth/interface/http/middlewares/get-connected-user");
const update_user_profile_usecase_1 = require("../../../../../modules/users/application/usecases/update-user-profile.usecase");
const update_user_profile_error_1 = require("../../../../../modules/users/application/errors/update-user-profile.error");
const add_user_interaction_usecase_1 = require("../../../../../modules/users/application/usecases/add-user-interaction.usecase");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const upload_dest_1 = require("../../../../../modules/users/application/consts/upload-dest");
const accepted_mimetype_1 = require("../../../../../modules/users/application/consts/accepted-mimetype");
const extract_file_extension_1 = require("../../../../../../../shared/extract-file-extension");
const delete_user_image_usecase_1 = require("../../../../../modules/users/application/usecases/delete-user-image.usecase");
const reorder_user_image_usecase_1 = require("../../../../../modules/users/application/usecases/reorder-user-image-usecase");
const get_all_tags_usecase_1 = require("../../../../../modules/users/application/usecases/get-all-tags.usecase");
const fetch_best_user_suggestion_usecase_1 = require("../../../../../modules/users/application/usecases/fetch-best-user-suggestion.usecase");
const get_user_list_from_id_usecase_1 = require("../../../../../modules/users/application/usecases/get-user-list-from-id.usecase");
const inversify_type_1 = require("../../../../../config/ioc/inversify-type");
const check_user_identifier_availability_dto_validation_1 = require("../../validations/check-user-identifier-availability-dto.validation");
const get_user_profile_list_dto_validation_1 = require("../../validations/get-user-profile-list-dto.validation");
const update_user_profile_dto_validation_1 = require("../../validations/update-user-profile-dto.validation");
const delete_user_image_dto_validation_1 = require("../../validations/delete-user-image-dto.validation");
const reorder_images_dto_validations_1 = require("../../validations/reorder-images-dto.validations");
const create_user_interaction_dto_validation_1 = require("../../validations/create-user-interaction-dto.validation");
const filter_users_dto_validation_1 = require("../../validations/filter-users-dto.validation");
const filter_users_usecase_1 = require("../../../../../modules/users/application/usecases/filter-users.usecase");
const verify_token_error_1 = require("../../../../../modules/auth/application/errors/verify-token.error");
let UserController = class UserController {
    constructor(getCurrentUserUseCase, CheckUserIdentifierAvailabilityUseCase, accessTokenService, updateUserProfileUseCase, addUserInteractionUseCase, deleteImageUseCase, reorderUserImageUseCase, getAllTagsUseCase, fetchBestUserSuggestion, getUserListFromIdListUseCase, filterUsersUseCase) {
        this.getCurrentUserUseCase = getCurrentUserUseCase;
        this.CheckUserIdentifierAvailabilityUseCase = CheckUserIdentifierAvailabilityUseCase;
        this.accessTokenService = accessTokenService;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
        this.addUserInteractionUseCase = addUserInteractionUseCase;
        this.deleteImageUseCase = deleteImageUseCase;
        this.reorderUserImageUseCase = reorderUserImageUseCase;
        this.getAllTagsUseCase = getAllTagsUseCase;
        this.fetchBestUserSuggestion = fetchBestUserSuggestion;
        this.getUserListFromIdListUseCase = getUserListFromIdListUseCase;
        this.filterUsersUseCase = filterUsersUseCase;
    }
    async getMe(req, resp) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const getCurrentUserResult = await this.getCurrentUserUseCase.execute(connectedUserResult.data);
        if (getCurrentUserResult.isErr) {
            resp.status(404).send('User not found');
            return;
        }
        const { passwd: _passwd, ...safeUser } = getCurrentUserResult.data;
        resp.status(200).json(safeUser);
    }
    async filterUsers(req, resp) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const parsedBody = filter_users_dto_validation_1.FilterUsersDtoSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('Bad request');
            return;
        }
        const filteredUsers = await this.filterUsersUseCase.execute(parsedBody.data, connectedUserResult.data);
        const safeUserList = filteredUsers.map((user) => {
            const { passwd: _passwd, email: _email, ...safeUser } = user;
            return { ...safeUser, blocked: [] };
        });
        resp.status(200).send(safeUserList);
    }
    async viewUserProfile(req, resp, { isViewing } = { isViewing: false }) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const { id } = req.params;
        const getCurrentUserResult = await this.getCurrentUserUseCase.execute(connectedUserResult.data, id, isViewing);
        if (getCurrentUserResult.isErr) {
            const error = getCurrentUserResult.error;
            if (error === verify_token_error_1.VerifyTokenError.FORBIDDEN) {
                resp.status(403).send('Forbidden');
                return;
            }
            resp.status(404).send('User not found');
            return;
        }
        const { passwd: _passwd, email: _email, ...safeUser } = getCurrentUserResult.data;
        resp.status(200).json(safeUser);
    }
    async viewUserProfileList(req, resp) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const parsedBody = get_user_profile_list_dto_validation_1.GetUserProfileListSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('Bad request');
            return;
        }
        const userIdList = parsedBody.data.userIdList;
        const userList = await this.getUserListFromIdListUseCase.execute(userIdList);
        const safeUserList = userList.map((user) => {
            const { email: _email, ...safeUser } = user;
            return { ...safeUser, blocked: [] };
        });
        resp.status(200).send(safeUserList);
    }
    async checkUserIdentifierAvailability(req, resp) {
        const parsedBody = check_user_identifier_availability_dto_validation_1.CheckUserIdentifierAvailabilityDtoSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('Bad request');
            return;
        }
        const { field, value } = parsedBody.data;
        const isUserIdentifierAvailable = await this.CheckUserIdentifierAvailabilityUseCase.execute(field, value);
        resp.status(200).json({ available: isUserIdentifierAvailable });
    }
    async updateUserProfile(req, resp) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const userId = connectedUserResult.data;
        const parsedBody = update_user_profile_dto_validation_1.UpdateUserProfileDtoSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('Bad request');
            return;
        }
        const updateUserProfileDto = {
            ...parsedBody.data,
        };
        const updateUserProfileResult = await this.updateUserProfileUseCase.execute(userId, updateUserProfileDto);
        if (updateUserProfileResult.isErr) {
            const error = updateUserProfileResult.error;
            this.handleUpdateUserProfileInfosError(error, resp);
            return;
        }
        resp.status(200).send('updated user successfully');
    }
    handleUpdateUserProfileInfosError(error, resp) {
        switch (error) {
            case update_user_profile_error_1.UpdateUserProfileError.USER_NOT_FOUND:
                return resp.status(404).send('user not found');
            case update_user_profile_error_1.UpdateUserProfileError.USERNAME_ALREADY_EXISTS:
                return resp.status(409).send('username already used');
            case update_user_profile_error_1.UpdateUserProfileError.EMAIL_AREDAY_EXISTS:
                return resp.status(409).send('email already used');
            default:
                return resp
                    .status(500)
                    .send('server internal error, please retry later');
        }
    }
    async addUserInteraction(req, resp) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const userId = connectedUserResult.data;
        const parsedBody = create_user_interaction_dto_validation_1.CreateInteractionDtoSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('Bad request');
            return;
        }
        const addInteractionResult = await this.addUserInteractionUseCase.execute(parsedBody.data, userId);
        if (addInteractionResult.isErr) {
            const error = addInteractionResult.error;
            this.handleAddUserInteractionError(error, resp);
            return;
        }
        resp.status(201).send('user interaction sucessfully added');
    }
    handleAddUserInteractionError(error, resp) {
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
    async getImage(req, resp) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const { filename } = req.params;
        if (!filename) {
            resp.status(400).send('bad request');
            return;
        }
        const path = (0, node_path_1.join)(process.cwd(), upload_dest_1.UPLOAD_DEST, filename);
        if (!(0, node_fs_1.existsSync)(path)) {
            resp.status(404).send('image not found');
            return;
        }
        const fileStream = (0, node_fs_1.createReadStream)(path);
        const type = accepted_mimetype_1.AcceptedMimeType.get((0, extract_file_extension_1.extractFileExtension)(path));
        if (!type) {
            resp.status(400).send('wrong extension');
            return;
        }
        resp.writeHead(200, {
            'Content-Type': `image/${type}`,
            'Content-Length': (0, node_fs_1.statSync)(path).size,
            'Cross-Origin-Resource-Policy': 'same-site | same-origin | cross-origin',
        });
        fileStream.pipe(resp);
    }
    async deleteImages(req, resp) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const parsedBody = delete_user_image_dto_validation_1.DeleteUserImageDtoSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('bad request');
            return;
        }
        const userId = connectedUserResult.data;
        const imageListToDelete = parsedBody.data.images;
        await this.deleteImageUseCase.execute(userId, imageListToDelete);
        resp.status(200).send('image sucessfully deleted');
    }
    async reorderImages(req, resp) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const parsedBody = reorder_images_dto_validations_1.ReorderImagesDtoSchema.safeParse(req.body);
        if (!parsedBody.success) {
            resp.status(400).send('bad request');
            return;
        }
        const userId = connectedUserResult.data;
        const newImagePositions = parsedBody.data.images;
        await this.reorderUserImageUseCase.execute(userId, newImagePositions);
        resp.status(200).send('image sucessfully reordered');
    }
    async findAllInterests(req, resp) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const interestList = await this.getAllTagsUseCase.execute();
        resp.status(200).send({ interestList });
    }
    async browse(req, resp) {
        const connectedUserResult = await (0, get_connected_user_1.getConnectedUserId)(this.accessTokenService, req, resp);
        if (connectedUserResult.isErr) {
            resp.status(401).send('Invalid token');
            return;
        }
        const bestUserSuggestion = await this.fetchBestUserSuggestion.execute(connectedUserResult.data);
        if (!bestUserSuggestion) {
            resp.status(204).send('no profile to show');
            return;
        }
        resp.status(200).json(bestUserSuggestion);
    }
    async geoGode(req, resp) {
        const { lat, lng } = req.query;
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const result = await fetch(url, {
            headers: {
                'User-Agent': 'matcha-app',
            },
        });
        if (!result.ok) {
            resp.status(500).send('Reverse geocoding failed');
            return;
        }
        const data = await result.json();
        resp.status(200).send(data);
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(get_current_user_usecase_1.GetCurrentUserUseCase)),
    __param(1, (0, inversify_1.inject)(check_user_identifier_availability_usecase_1.CheckUserIdentifierAvailabilityUseCase)),
    __param(2, (0, inversify_1.inject)(inversify_type_1.TYPE.AccessTokenService)),
    __param(3, (0, inversify_1.inject)(update_user_profile_usecase_1.UpdateUserProfileUseCase)),
    __param(4, (0, inversify_1.inject)(add_user_interaction_usecase_1.AddUserInteractionUseCase)),
    __param(5, (0, inversify_1.inject)(delete_user_image_usecase_1.DeleteUserImageUsceCase)),
    __param(6, (0, inversify_1.inject)(reorder_user_image_usecase_1.ReorderUserImageUseCase)),
    __param(7, (0, inversify_1.inject)(get_all_tags_usecase_1.GetAllTagsUseCase)),
    __param(8, (0, inversify_1.inject)(fetch_best_user_suggestion_usecase_1.FetchBestUserSuggestion)),
    __param(9, (0, inversify_1.inject)(get_user_list_from_id_usecase_1.GetUserListFromIdListUseCase)),
    __param(10, (0, inversify_1.inject)(filter_users_usecase_1.FilterUsersUseCase)),
    __metadata("design:paramtypes", [get_current_user_usecase_1.GetCurrentUserUseCase,
        check_user_identifier_availability_usecase_1.CheckUserIdentifierAvailabilityUseCase, Object, update_user_profile_usecase_1.UpdateUserProfileUseCase,
        add_user_interaction_usecase_1.AddUserInteractionUseCase,
        delete_user_image_usecase_1.DeleteUserImageUsceCase,
        reorder_user_image_usecase_1.ReorderUserImageUseCase,
        get_all_tags_usecase_1.GetAllTagsUseCase,
        fetch_best_user_suggestion_usecase_1.FetchBestUserSuggestion,
        get_user_list_from_id_usecase_1.GetUserListFromIdListUseCase,
        filter_users_usecase_1.FilterUsersUseCase])
], UserController);
