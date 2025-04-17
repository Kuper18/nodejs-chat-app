import { z } from 'zod';

export const messageSchema = z.object({
  content: z.string().min(1),
  recipientId: z.number().int(),
  senderId: z.number().int(),
  roomId: z.number().int(),
});
