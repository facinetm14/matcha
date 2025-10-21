import { UserProfile } from '@/core/domain/entities/user-profile.entity';
import { User } from '../../core/domain/entities/user.entity';
import { UserModel } from '../../infrastructure/persistence/models/user.model';

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

export type UserAggregate = UserModel & {interest: string};
export function buildUserProfileFromUserAggregate(userAggregate: UserAggregate[]): UserProfile[] {
  const userProfilesMap: Map<string, UserProfile> = new Map();
  
  for (const user of userAggregate) {
    if (!userProfilesMap.has(user.id)) {
      userProfilesMap.set(user.id, {
        user:{...mapUserModelToEntity(user), interests: user.interest ? [user.interest] : []},
      });
      continue;
    }

    const existingProfile = userProfilesMap.get(user.id);
    if (existingProfile && user.interest) {
      existingProfile.user.interests?.push(user.interest);
    }
  }
  
  return [...userProfilesMap.values()];
}

