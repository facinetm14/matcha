import { injectable } from 'inversify';
import { UserProfile } from '../../domain/entities/user-profile.entity';

@injectable()
export class FilterUsersUseCase {
  //TODO to be implemented
  async execute(): Promise<UserProfile[]> {
    return [];
  }
}
