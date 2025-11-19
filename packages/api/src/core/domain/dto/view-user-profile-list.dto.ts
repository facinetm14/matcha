import * as z from 'zod';

export const ViewUserProfileListSchema = z.object({
  userIdList: z.array(z.string()),
});

export type ViewUserProfileListDto = z.infer<typeof ViewUserProfileListSchema>;
