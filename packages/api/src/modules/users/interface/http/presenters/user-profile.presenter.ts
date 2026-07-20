import { UserProfile } from '@/modules/users/domain/entities/user-profile.entity';

export type OwnUserProfileView = Omit<UserProfile, 'passwd'>;
export type PublicUserProfileView = Omit<UserProfile, 'passwd' | 'email'>;

export function toOwnUserProfileView(user: UserProfile): OwnUserProfileView {
  const { passwd: _passwd, ...ownProfile } = user;
  return ownProfile;
}

export function toPublicUserProfileView(
  user: UserProfile,
): PublicUserProfileView {
  const { passwd: _passwd, email: _email, ...publicProfile } = user;
  return { ...publicProfile, blocked: [] };
}
