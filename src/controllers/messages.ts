import { Request, Response } from 'express';
import prisma from '../modules/prisma';
import { messageSchema, readMessageSchema, updateMessageSchema } from '../validators/messages';
import { getIO } from '../modules/socket';

export const getMessages = async (
  req: Request,
  res: Response
): Promise<any> => {
  const roomId = Number(req.params.roomId);

  if (isNaN(roomId)) {
    return res.status(400).json({ message: 'roomId must be a number.' });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
    });

    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Cannot get messages at the moment.' });
  }
};

export const getUnreadMessagesCount = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = Number(req.sub.id);

  try {
    const groupedCount = await prisma.message.groupBy({
      by: ['senderId'],
      where: {
        recipientId: userId,
        isRead: false,
      },
      _count: { _all: true },
    });

    const result = groupedCount.map(({ _count, senderId }) => ({
      senderId,
      count: _count._all,
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Cannot get messages at the moment.' });
  }
};

export const createMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parseResult = messageSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ message: parseResult.error });
  }

  const { content, roomId, recipientId, senderId } = parseResult.data;

  try {
    const message = await prisma.message.create({
      data: { content, roomId, recipientId, senderId },
    });

    const io = getIO();

    io.to(`room-${roomId}`).emit('private-message', message);

    return res.status(201).json(message);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Cannot create a message at the moment.' });
  }
};

export const updateMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const messageId = Number(req.params.messageId);

  if (isNaN(messageId)) {
    return res.status(400).json({ message: 'messageId must be a number.' });
  }

  const parseResult = updateMessageSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ message: parseResult.error });
  }

  const userId = Number(req.sub.id);
  const { content } = parseResult.data;

  try {
    const message = await prisma.message.update({
      where: {
        id: messageId,
        senderId: userId,
      },
      data: {
        content,
      },
    });

    return res.status(200).json(message);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Cannot update the message at the moment.' });
  }
};

export const readMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const messageId = Number(req.params.messageId);

  if (isNaN(messageId)) {
    return res.status(400).json({ message: 'messageId must be a number.' });
  }

  const parseResult = readMessageSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ message: parseResult.error });
  }

  const { isRead, recipientId } = parseResult.data;

  try {
    const message = await prisma.message.update({
      where: {
        id: messageId,
        recipientId,
      },
      data: {
        isRead,
      },
    });

    return res.status(200).json(message);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Cannot update the message at the moment.' });
  }
};
