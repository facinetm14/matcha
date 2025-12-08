import { UserProfile } from '@/modules/users/domain/entities/user-profile.entity';
import { UserRepository } from '@/modules/users/application/ports/repositories/user.repository';
import { inject, injectable } from 'inversify';
import { TYPE } from '@/config/ioc/inversify-type';
import {
  calculateDistanceKm,
  MAX_SUGGESTED_DISTANCE_KM,
} from '@shared/distance';

@injectable()
export class FetchBestUserSuggestion {
  constructor(
    @inject(TYPE.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<UserProfile[]> {
    const connectedUser = await this.userRepository.findUserProfileById(userId);
    if (!connectedUser) {
      return [];
    }

    const userList = await this.userRepository.findAllUsers(userId);
    const distanceFromConnectedUser = new Map<string, number>();
    const sharedTagsWithConnectedUser = new Map<string, number>();

    const suggestedUsers: UserProfile[] = [];

    const sexPref = connectedUser?.sexualOrientation ?? [];

    for (const user of userList) {
      let matched = false;
      if (!sexPref.length && user.gender === connectedUser?.gender) {
        continue;
      }

      const distance = calculateDistanceKm(
        connectedUser.location,
        user.location,
      );

      if (distance < MAX_SUGGESTED_DISTANCE_KM) {
        distanceFromConnectedUser.set(user.id, distance);
        matched = true;
      }

      const combinedTags = [...user.tags, ...connectedUser.tags];
      const sharedTag = combinedTags.length - new Set([...combinedTags]).size;
      if (sharedTag) {
        if (!matched) {
          matched = true;
        }

        sharedTagsWithConnectedUser.set(user.id, sharedTag);
      }

      if (matched) {
        suggestedUsers.push(user);
      }
    }

    return suggestedUsers.sort((a, b) =>
      this.smartSort(
        {
          distance: distanceFromConnectedUser.get(a.id)!,
          sharedTags: sharedTagsWithConnectedUser.get(a.id)!,
          fameRating: a.fameRating,
        },
        {
          distance: distanceFromConnectedUser.get(b.id)!,
          sharedTags: sharedTagsWithConnectedUser.get(b.id)!,
          fameRating: b.fameRating,
        },
      ),
    );
  }

  private smartSort(
    user1: { distance: number; sharedTags: number; fameRating: number },
    user2: { distance: number; sharedTags: number; fameRating: number },
  ): number {
    if (user1.distance !== user2.distance) {
      return user1.distance - user2.distance;
    }

    if (user1.sharedTags !== user2.sharedTags) {
      return user1.sharedTags - user2.sharedTags;
    }

    return user1.fameRating - user2.fameRating;
  }
}
