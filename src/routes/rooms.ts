import express, { Request, Response } from 'express';

import auth from '../middleware/auth';
import prisma from '../modules/prisma';
import { roomSchema } from '../validators/rooms';

const router = express.Router();

router.get('/', auth, async (req: Request, res: Response): Promise<any> => {
  const currentUserId = Number(req.sub.id);
  const peerIdParam = req.query.peerId;

  if (!peerIdParam) {
    return res
      .status(400)
      .send({ message: 'peerId query parameter is required' });
  }

  const peerId = Number(peerIdParam);

  if (isNaN(peerId)) {
    return res.status(400).send({ message: 'peerId must be a number' });
  }

  try {
    const room = await prisma.room.findFirst({
      where: {
        users: { some: { id: currentUserId } },
        AND: { users: { some: { id: peerId } } },
      },
      include: { users: true },
    });

    return res.status(200).json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return res
      .status(500)
      .send({ message: 'Cannot get the room at the moment.' });
  }
});

router.post('/', auth, async (req: Request, res: Response) => {
  const parseResult = roomSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).send({ message: parseResult.error });
    return;
  }

  const { name, peerId } = parseResult.data;
  const currentUserId = Number(req?.sub?.id);

  const room = await prisma.room.create({
    data: {
      users: { connect: [{ id: currentUserId }, { id: +peerId }] },
      name,
    },
  });

  res.status(201).send(room);
});

export default router;
