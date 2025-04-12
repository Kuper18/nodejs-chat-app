import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(3).max(15),
  lastName: z.string().min(3).max(15),
  password: z.string().min(8).max(24),
});

export const loginSchema = signupSchema.pick({ email: true, password: true });