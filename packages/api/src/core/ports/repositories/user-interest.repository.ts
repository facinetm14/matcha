import { UserInterestColumns } from '@/core/domain/enums/user-interest-columns.enum';

export interface UserInterestRepository {
  create(id: string, userId: string, interest: string): Promise<void>;
  findAllByColumn(column: UserInterestColumns, value: string): Promise<string[]>;
}
