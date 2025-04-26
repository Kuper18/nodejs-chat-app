import { z } from 'zod';

export const messageSchema = z.object({
  content: z.string().min(1),
  recipientId: z.number().int(),
  senderId: z.number().int(),
  roomId: z.number().int(),
});

export const updateMessageSchema = messageSchema.pick({ content: true });

export const readMessageSchema = z.object({
  isRead: z.boolean(),
  recipientId: z.number().int(),
});
