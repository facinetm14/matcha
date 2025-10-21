import { UserInterest } from '@/core/domain/entities/user-interest.entity';
import { UserInterestColumns } from '@/core/domain/enums/user-interest-columns.enum';

export interface UserInterestRepository {
  bulkCreate(userId: string, interest: string[]): Promise<void>;
  findAllByColumn(
    column: UserInterestColumns,
    value: string | null,
  ): Promise<UserInterest[]>;
  findAll(): Promise<UserInterest[]>;
}
