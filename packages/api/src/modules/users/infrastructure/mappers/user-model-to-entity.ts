import {
  Gender,
  UserProfile,
} from '@/modules/users/domain/entities/user-profile.entity';
import { User } from '../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { InteractionCategory } from '@/modules/users/domain/entities/user-profile-interaction.entity';
import { skipUnecessaryNotification } from '@/modules/notifications/application/utils/notification-utils';
import { calculateFameRating } from '../../domain/services/calculate-fame-rating';
import { calculateAge } from '../../domain/services/calculate-age';

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
};

export function buildUserProfileFromUserAggregate(
  userAggregate: UserAggregate[],
): UserProfile[] {
  const userProfilesMap: Map<string, UserProfile> = new Map();
  const interactors: Set<string> = new Set();
  const visitedTags: Set<string> = new Set();
  const visitedImages: Set<string> = new Set();
  const visitedNotif: Set<string> = new Set();

  const now = new Date();

  for (const user of userAggregate) {
    const interactionKey = `${user.id}+${user.author}+${user.interaction_recipient}+${user.category}`;
    const tagKey = `${user.id}+${user.interest}`;

    if (isCorrectCategory('block', user.author, user.category)) {
      console.log({ user });
    }

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
      userProfilesMap.set(user.id, {
        ...mapUserModelToEntity(user),
        tags: user.interest ? [user.interest] : [],
        fameRating: 0,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        likedBy: isCorrectCategory('like', user.author, user.category)
          ? [user.author]
          : [],
        viewedBy: isCorrectCategory('view', user.author, user.category)
          ? [user.author]
          : [],
        blocked:
          isCorrectCategory(
            'block',
            user.interaction_recipient,
            user.category,
          ) && user.id === user.author
            ? [user.interaction_recipient]
            : [],

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
        sexualOrientation: (user.sexual_orientation?.split(' ') ??
          []) as Gender[],
      });

      interactors.add(interactionKey);
      visitedTags.add(tagKey);
      visitedImages.add(user.img_id);
      visitedNotif.add(notification.id);
      continue;
    }

    const existingProfile = userProfilesMap.get(user.id)!;
    if (user.interest && !visitedTags.has(tagKey)) {
      existingProfile.tags.push(user.interest);
      visitedTags.add(tagKey);
    }

    if (!interactors.has(interactionKey)) {
      if (isCorrectCategory('view', user.author, user.category)) {
        existingProfile.viewedBy.push(user.author);
      }

      if (isCorrectCategory('like', user.author, user.category)) {
        existingProfile.likedBy.push(user.author);
      }

      if (
        isCorrectCategory('block', user.interaction_recipient, user.category) &&
        user.author === user.id
      ) {
        existingProfile.blocked.push(user.interaction_recipient);
      }

      interactors.add(interactionKey);
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
  }

  return [...userProfilesMap.values()].map((profile) => ({
    ...profile,
    fameRating: calculateFameRating(profile),
    photos: profile.photos.sort((a, b) => a.position - b.position),
    notifications: skipUnecessaryNotification(
      profile.notifications.sort((a, b) =>
        new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1,
      ),
    ),
  }));
}
