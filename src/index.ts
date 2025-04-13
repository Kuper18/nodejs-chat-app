import express from 'express';
import cors from 'cors';

import prisma from './prisma';

import users from './routes/users';
import rooms from './routes/rooms';
import messages from './routes/messages';
import refreshToken from './routes/refresh-token';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/users', users);
app.use('/api/rooms', rooms);
app.use('/api/messages', messages);
app.use('/api/refresh-token', refreshToken);

prisma
  .$connect()
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.error('Failed to connect to the database:', error));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
