import express, { Request, Response } from 'express';

import auth from '../middleware/auth';
import prisma from '../prisma';
import { messageSchema } from '../validators/messages';

const router = express.Router();

router.get(
  '/:roomId',
  auth,
  async (req: Request, res: Response): Promise<any> => {
    const roomId = Number(req.params.roomId);

    if (isNaN(roomId)) {
      return res.status(400).json({ message: 'roomId must be a number.' });
    }

    try {
      const messages = await prisma.message.findMany({ where: { roomId } });

      return res.status(200).json(messages);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Cannot get messages at the moment.' });
    }
  }
);

router.post('/', auth, async (req: Request, res: Response): Promise<any> => {
  const parseResult = messageSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ message: parseResult.error });
  }

  const { content, roomId, userId } = parseResult.data;

  try {
    const message = await prisma.message.create({
      data: { content, roomId, userId },
    });
  
    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: 'Cannot create a message at the moment.'})
  }
});

export default router;
