import * as z from 'zod';

export const UpdateUserProfileDtoSchema = z.object({
  user: z.object({
    email: z.email().optional(),
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    passwd: z.string().optional(),
    confirmPasswd: z.string().optional(),
    gender: z.string().optional().optional(),
    sexualOrientation: z.string().optional(),
    bio: z.string().optional()
  }).optional(),
  interests: z.array(z.string()).optional()
})


export type UpdateUserProfileDto = z.infer<typeof UpdateUserProfileDtoSchema>;