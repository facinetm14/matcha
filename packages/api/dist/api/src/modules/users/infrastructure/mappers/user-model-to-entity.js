"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserModelToEntity = mapUserModelToEntity;
exports.buildCity = buildCity;
exports.buildUserProfileFromUserAggregate = buildUserProfileFromUserAggregate;
const notification_utils_1 = require("../../../../modules/notifications/application/utils/notification-utils");
const calculate_fame_rating_1 = require("../../domain/services/calculate-fame-rating");
const calculate_age_1 = require("../../domain/services/calculate-age");
const extract_city_from_geocode_1 = require("../../../../../../shared/extract-city-from-geocode");
function mapUserModelToEntity(userModel) {
    return {
        id: userModel.id,
        username: userModel.username,
        updatedAt: userModel.updated_at,
        createdAt: userModel.created_at,
        firstName: userModel.first_name,
        lastName: userModel.last_name,
        email: userModel.email,
        passwd: userModel.passwd,
        status: userModel.status,
        isFirstLogin: userModel.is_first_login,
        gender: userModel.gender,
        bio: userModel.bio,
        birthDate: userModel.birth_date,
        sexualOrientation: userModel.sexual_orientation,
    };
}
const isCorrectCategory = (categoryToMatch, author, category) => {
    return author && category === categoryToMatch;
};
async function buildCity(lat, lng) {
    const result = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: {
            'User-Agent': 'matcha-app',
        },
    });
    if (!result.ok) {
        return undefined;
    }
    const data = await result.json();
    return (0, extract_city_from_geocode_1.extractCityFromGeocode)(data.address);
}
async function buildUserProfileFromUserAggregate(userAggregate) {
    const userProfilesMap = new Map();
    const interactors = new Set();
    const visitedTags = new Set();
    const visitedImages = new Set();
    const visitedNotif = new Set();
    const now = new Date();
    for (const user of userAggregate) {
        const interactionKey = `${user.id}+${user.author}+${user.interaction_recipient}+${user.category}`;
        const tagKey = `${user.id}+${user.interest}`;
        const notification = {
            id: user.notif_id,
            isRead: user.notif_is_read ? true : false,
            author: user.notif_author,
            fromUser: user.notif_from_user,
            createdAt: user.notif_created_at,
            updatedAt: user.notif_updated_at,
            category: user.notif_category,
        };
        if (!userProfilesMap.has(user.id)) {
            const currentUserProfile = {
                ...mapUserModelToEntity(user),
                tags: user.interest ? [user.interest] : [],
                fameRating: 0,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen,
                likedBy: [],
                viewedBy: [],
                blocked: [],
                swiped: [],
                matched: user.notif_category === 'match' ? [user.notif_id] : [],
                notifications: user.notif_author ? [notification] : [],
                reported: false,
                photos: user.img_id
                    ? [
                        {
                            id: user.img_id,
                            userId: user.id,
                            position: +user.img_position,
                            preview: `http://localhost:5000/api/v1/users/images/${user.img_preview}`,
                        },
                    ]
                    : [],
                age: user.birth_date ? (0, calculate_age_1.calculateAge)(user.birth_date, now) : undefined,
                sexualOrientation: (user.sexual_orientation?.split(' ') ?? [
                    'male',
                    'female',
                ]),
                ...(user.location_id && {
                    location: {
                        isEnabledByUser: user.location_shared_by_user_at ? true : false,
                        lat: +user.location_lat,
                        lng: +user.location_lng,
                        city: user.location_city,
                    },
                }),
            };
            visitedImages.add(user.img_id);
            visitedNotif.add(notification.id);
            visitedTags.add(tagKey);
            userProfilesMap.set(user.id, currentUserProfile);
            if (isCorrectCategory('view', user.author, user.category)) {
                currentUserProfile.viewedBy.push(user.author);
                interactors.add(interactionKey);
            }
            if (isCorrectCategory('like', user.author, user.category)) {
                currentUserProfile.likedBy.push(user.author);
                interactors.add(interactionKey);
            }
            if (isCorrectCategory('block', user.interaction_recipient, user.category) &&
                user.author === user.id) {
                currentUserProfile.blocked.push(user.interaction_recipient);
                interactors.add(interactionKey);
            }
            if (isCorrectCategory('swipe', user.interaction_recipient, user.category) &&
                user.author === user.id) {
                currentUserProfile.swiped.push(user.interaction_recipient);
                interactors.add(interactionKey);
            }
            continue;
        }
        const existingProfile = userProfilesMap.get(user.id);
        if (user.interest && !visitedTags.has(tagKey)) {
            existingProfile.tags.push(user.interest);
            visitedTags.add(tagKey);
        }
        if (user.img_id && !visitedImages.has(user.img_id)) {
            existingProfile.photos.push({
                id: user.img_id,
                userId: user.id,
                position: +user.img_position,
                preview: `http://localhost:5000/api/v1/users/images/${user.img_preview}`,
            });
            visitedImages.add(user.img_id);
        }
        if (!visitedNotif.has(notification.id)) {
            existingProfile.notifications.push(notification);
            if (notification.category === 'match') {
                existingProfile.matched.push(notification.id);
            }
            visitedNotif.add(notification.id);
        }
        if (interactors.has(interactionKey)) {
            continue;
        }
        if (isCorrectCategory('view', user.author, user.category)) {
            existingProfile.viewedBy.push(user.author);
            interactors.add(interactionKey);
        }
        if (isCorrectCategory('like', user.author, user.category)) {
            existingProfile.likedBy.push(user.author);
            interactors.add(interactionKey);
        }
        if (isCorrectCategory('block', user.interaction_recipient, user.category) &&
            user.author === existingProfile.id) {
            existingProfile.blocked.push(user.interaction_recipient);
            interactors.add(interactionKey);
        }
        if (isCorrectCategory('swipe', user.interaction_recipient, user.category) &&
            user.author === existingProfile.id) {
            existingProfile.swiped.push(user.interaction_recipient);
            interactors.add(interactionKey);
        }
        if (!existingProfile.location && user.location_id) {
            existingProfile.location = {
                isEnabledByUser: user.location_shared_by_user_at ? true : false,
                lat: +user.location_lat,
                lng: +user.location_lng,
                city: user.location_city,
            };
        }
    }
    return [...userProfilesMap.values()].map((profile) => ({
        ...profile,
        fameRating: (0, calculate_fame_rating_1.calculateFameRating)(profile),
        photos: profile.photos.sort((a, b) => a.position - b.position),
        notifications: (0, notification_utils_1.skipUnecessaryNotification)(profile.blocked, profile.notifications.sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1)),
        tags: profile.tags.sort((a, b) => (a < b ? -1 : 1)),
    }));
}
