import { CreateInteractionDto } from '@/core/domain/dto/create-interaction.dto';

export interface UserInteractionRepository {
  create(
    createInteractionDto: CreateInteractionDto,
    author: string,
  ): Promise<string | null>;
}
