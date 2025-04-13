import { z } from 'zod';

export const messageSchema = z.object({
  content: z.string().min(1),
  userId: z.number().int(),
  roomId: z.number().int(),
});
