import { Server as HttpServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';

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

    const roomId = socket.handshake.query.roomId;

    if (roomId) {
      socket.join(`room-${roomId}`)
    }

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
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
