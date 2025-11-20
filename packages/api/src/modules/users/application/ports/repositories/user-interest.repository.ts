import { UserInterest } from '@/modules/users/domain/entities/user-interest.entity';
import { UserInterestColumns } from '@/modules/users/application/consts/user-interest-columns.enum';

export interface UserInterestRepository {
  bulkCreate(userId: string, interest: string[]): Promise<void>;
  findAllByColumn(
    column: UserInterestColumns,
    value: string | null,
  ): Promise<UserInterest[]>;
  findAll(): Promise<string[]>;
  deleteByUserId(userId: string): Promise<void>;
}
