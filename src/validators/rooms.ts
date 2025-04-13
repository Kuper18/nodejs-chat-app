import { z } from 'zod';

export const roomSchema = z.object({
  name: z.string().min(4).max(15),
  peerId: z.number().int(),
});
