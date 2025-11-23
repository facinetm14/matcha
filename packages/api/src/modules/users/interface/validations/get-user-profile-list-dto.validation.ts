import * as z from 'zod';

export const GetUserProfileListSchema = z.object({
  userIdList: z.array(z.string()),
});
