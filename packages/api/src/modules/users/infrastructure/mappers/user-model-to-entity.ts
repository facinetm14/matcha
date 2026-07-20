import {
  Gender,
  UserProfile,
} from '@/modules/users/domain/entities/user-profile.entity';
import { User } from '../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { InteractionCategory } from '@/modules/shared/domain/interaction-category';
import { skipUnecessaryNotification } from '@/modules/notifications/application/utils/notification-utils';
import { calculateFameRating } from '../../domain/services/calculate-fame-rating';
import { calculateAge } from '../../domain/services/calculate-age';
import {
  extractCityFromGeocode,
  GeocodeAddressType,
} from '@shared/extract-city-from-geocode';

export function mapUserModelToEntity(userModel: UserModel): User {
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

const isCorrectCategory = (
  categoryToMatch: InteractionCategory,
  author?: string,
  category?: InteractionCategory,
) => {
  return author && category === categoryToMatch;
};

export type UserAggregate = UserModel & {
  interest: string;
  tag_id: string;
  author: string;
  category: InteractionCategory;
  img_position: string;
  img_preview: string;
  img_id: string;
  isOnline: boolean;
  lastSeen: Date | null;
  notif_id: string;
  notif_author: string;
  notif_from_user: string;
  notif_created_at: Date;
  notif_updated_at: Date;
  notif_is_read: Date;
  notif_category: InteractionCategory;
  sexual_orientation: string;
  interaction_recipient: string;
  interaction_id: string;
  location_id: string;
  location_city: string;
  location_lat: string;
  location_lng: string;
  location_shared_by_user_at: Date | null;
};

export async function buildCity(
  lat: number,
  lng: number,
): Promise<string | undefined> {
  const result = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    {
      headers: {
        'User-Agent': 'matcha-app',
      },
    },
  );

  if (!result.ok) {
    return undefined;
  }

  const data = await result.json();

  return extractCityFromGeocode(data.address as GeocodeAddressType);
}

export async function buildUserProfileFromUserAggregate(
  userAggregate: UserAggregate[],
): Promise<UserProfile[]> {
  const userProfilesMap: Map<string, UserProfile> = new Map();
  const interactors: Set<string> = new Set();
  const visitedTags: Set<string> = new Set();
  const visitedImages: Set<string> = new Set();
  const visitedNotif: Set<string> = new Set();

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
      const currentUserProfile: UserProfile = {
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
        age: user.birth_date ? calculateAge(user.birth_date, now) : undefined,
        sexualOrientation: (user.sexual_orientation?.split(' ') ?? [
          'male',
          'female',
        ]) as Gender[],

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

      if (
        isCorrectCategory('block', user.interaction_recipient, user.category) &&
        user.author === user.id
      ) {
        currentUserProfile.blocked.push(user.interaction_recipient);
        interactors.add(interactionKey);
      }

      if (
        isCorrectCategory('swipe', user.interaction_recipient, user.category) &&
        user.author === user.id
      ) {
        currentUserProfile.swiped.push(user.interaction_recipient);
        interactors.add(interactionKey);
      }

      continue;
    }

    const existingProfile = userProfilesMap.get(user.id)!;
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

    if (
      isCorrectCategory('block', user.interaction_recipient, user.category) &&
      user.author === existingProfile.id
    ) {
      existingProfile.blocked.push(user.interaction_recipient);
      interactors.add(interactionKey);
    }

    if (
      isCorrectCategory('swipe', user.interaction_recipient, user.category) &&
      user.author === existingProfile.id
    ) {
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
    fameRating: calculateFameRating(profile),
    photos: profile.photos.sort((a, b) => a.position - b.position),
    notifications: skipUnecessaryNotification(
      profile.blocked,
      profile.notifications.sort((a, b) =>
        new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1,
      ),
    ),
    tags: profile.tags.sort((a, b) => (a < b ? -1 : 1)),
  }));
}
