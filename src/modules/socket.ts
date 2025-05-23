import { Server as HttpServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import redis from './redis';
import { TTypingData } from '../types';

let io: IOServer | undefined;

export const initSocket = (server: HttpServer): IOServer => {
  io = new IOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    socket.on('online', async (newUserId: number) => {
      await redis.hset(
        'online-users',
        socket.id,
        JSON.stringify({ userId: newUserId, socketId: socket.id })
      );
      const users = await redis.hvals('online-users');
      const parsedUsers = users.map((user) => JSON.parse(user));
      console.log(parsedUsers);

      io?.emit('get-online-users', parsedUsers);
    });

    socket.on('join-room', (roomId: number) => {
      console.log('user joined to the room with id:', roomId);

      const roomName = `room-${roomId}`;
      socket.join(roomName);
    });

    socket.on('typing', ({ roomId, userId, isTyping }: TTypingData) => {
      socket.broadcast
        .to(`room-${roomId}`)
        .emit('user-typing', { userId, isTyping });
    });

    socket.on('leave-room', (roomId: number) => {
      console.log('user leaved the room with id:', roomId);
      const roomName = `room-${roomId}`;
      socket.leave(roomName);
    });

    socket.on('disconnect', async () => {
      await redis.hdel('online-users', socket.id);

      const users = await redis.hvals('online-users');
      const parsedUsers = users.map((user) => JSON.parse(user));
      console.log(parsedUsers, 'disconnect...');

      io?.emit('get-online-users', parsedUsers);
    });
  });

  return io;
};

export const getIO = (): IOServer => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized.');
  }

  return io;
};
