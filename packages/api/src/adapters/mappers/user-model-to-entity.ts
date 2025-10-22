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
};
export function buildUserProfileFromUserAggregate(
  userAggregate: UserAggregate[],
): UserProfile[] {
  const userProfilesMap: Map<string, UserProfile> = new Map();
  const interactors: Set<string> = new Set();
  const visitedTags: Set<string> = new Set();

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
        photos: [],
        profilePhoto: '',
      });

      interactors.add(interactionKey);
      visitedTags.add(tagKey);
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
  }

  return [...userProfilesMap.values()];
}
