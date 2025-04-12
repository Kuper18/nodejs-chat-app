import express from 'express';
import prisma from './prisma';
import users from './routes/users';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use('/api/users', users);

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
