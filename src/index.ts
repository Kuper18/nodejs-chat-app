import express from 'express';
import prisma from './prisma';

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', async (req, res) => {
  const users = await prisma.user.findMany();

  res.send(users);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});