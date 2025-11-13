import { UserProfile } from '@/core/domain/entities/user-profile.entity';
import { User } from '../../core/domain/entities/user.entity';
import { UserModel } from '../../infrastructure/persistence/models/user.model';
import { InteractionCategory } from '@/core/domain/entities/user-profile-interaction.entity';

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
    sexualOrientation: userModel.sexual_orientation,
    bio: userModel.bio,
  };
}

const isCorrectCategory = (
  cateoryToMatch: InteractionCategory,
  author?: string,
  category?: InteractionCategory,
) => {
  return author && category === cateoryToMatch;
};

export type UserAggregate = UserModel & {
  interest: string;
  author: string;
  category: InteractionCategory;
  img_position: string;
  img_preview: string;
  img_id: string;
};
export function buildUserProfileFromUserAggregate(
  userAggregate: UserAggregate[],
): UserProfile[] {
  const userProfilesMap: Map<string, UserProfile> = new Map();
  const interactors: Set<string> = new Set();
  const visitedTags: Set<string> = new Set();
  const visitedImages: Set<string> = new Set();

  for (const user of userAggregate) {
    const interactionKey = `${user.id}+${user.author}+${user.category}`;
    const tagKey = `${user.id}+${user.interest}`;

    if (!userProfilesMap.has(user.id)) {
      userProfilesMap.set(user.id, {
        ...mapUserModelToEntity(user),
        tags: user.interest ? [user.interest] : [],
        fameRating: 0,
        isOnline: false,
        likedBy: isCorrectCategory('like', user.author, user.category)
          ? [user.author]
          : [],
        viewedBy: isCorrectCategory('view', user.author, user.category)
          ? [user.author]
          : [],
        reported: false,
        lastSeen: null,
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
        profilePhoto: '',
      });

      interactors.add(interactionKey);
      visitedTags.add(tagKey);
      visitedImages.add(user.img_id);
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
  }

  return [...userProfilesMap.values()].map(profile => ({...profile, photos: profile.photos.sort((a, b) => a.position - b.position)}));
}
