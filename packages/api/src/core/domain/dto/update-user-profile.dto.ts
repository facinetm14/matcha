import * as z from 'zod';

export const UpdateUserProfileDtoSchema = z.object({
  email: z.email().optional(),
  username: z.string().trim().min(3).optional(),
  firstName: z.string().trim().min(3).optional(),
  lastName: z.string().trim().min(3).optional(),
  passwd: z.string().optional(),
  confirmPasswd: z.string().optional(),
  birthDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  gender: z.enum(['male', 'female', 'non-binary']).optional(),
  sexualOrientation: z
    .array(z.enum(['male', 'female', 'non-binary']))
    .optional(),
  bio: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
  photos: z
    .array(
      z.object({
        dataInBase64: z.string(),
        position: z.number(),
      }),
    )
    .max(5, { message: 'You can upload up to 5 photos only.' })
    .optional(),
});

export type UpdateUserProfileDto = z.infer<typeof UpdateUserProfileDtoSchema>;
