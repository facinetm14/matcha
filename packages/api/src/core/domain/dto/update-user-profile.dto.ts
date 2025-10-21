import * as z from 'zod';

export const UpdateUserProfileDtoSchema = z.object({
  user: z
    .object({
      email: z.email().optional(),
      username: z.string().trim().min(3).optional(),
      firstName: z.string().trim().min(3).optional(),
      lastName: z.string().trim().min(3).optional(),
      passwd: z.string().optional(),
      confirmPasswd: z.string().optional(),
      gender: z.string().trim().min(1).optional().optional(),
      sexualOrientation: z.string().trim().min(1).optional(),
      bio: z.string().trim().optional(),
    })
    .optional(),
  interests: z.array(z.string()).optional(),
});

export type UpdateUserProfileDto = z.infer<typeof UpdateUserProfileDtoSchema>;
