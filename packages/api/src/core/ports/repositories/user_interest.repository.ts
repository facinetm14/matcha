import { UserInterestColumns } from '@/core/domain/enums/user-interest-columns.enum';

export interface UserInterestRepository {
  create(userId: string, interest: string): Promise<void>;
  findAllByColumn(column: UserInterestColumns, value: string): string[];
}
