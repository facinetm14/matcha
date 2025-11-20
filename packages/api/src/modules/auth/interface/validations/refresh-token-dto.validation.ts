import * as z from 'zod';

export const RefreshTokenDtoSchema = z.object({
  refreshToken: z.string(),
});
