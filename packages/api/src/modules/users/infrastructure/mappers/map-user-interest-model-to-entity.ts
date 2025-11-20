import { UserInterest } from '@/modules/users/domain/entities/user-interest.entity';
import { UserInterestModel } from '@/modules/users/infrastructure/models/user-interest.model';

export function mapUserInterestModelToEntity(
  userInterest: UserInterestModel,
): UserInterest {
  return {
    id: userInterest.id,
    userId: userInterest.user_id,
    createdAt: userInterest.created_at,
    updateAt: userInterest.updated_at,
    interest: userInterest.interest,
  };
}
