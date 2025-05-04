import { faker } from '@faker-js/faker';
import prisma from '../src/modules/prisma';

export async function main() {
  const users = Array.from({ length: 50 }).map(() => ({
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
  }));

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
}
