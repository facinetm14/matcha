export interface InterestRepository {
  findAll(): Promise<string[]>;
  create(interest: string): Promise<void>;
  doesExist(name: string): Promise<boolean>;
}