import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { loginSchema, signupSchema } from '../validators/auth';
import prisma from '../modules/prisma';
import { generateTokens } from '../services/auth';

export const signup = async (req: Request, res: Response): Promise<any> => {
  const parseResult = signupSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).send({ message: parseResult.error });
  }

  const { email, firstName, lastName, password } = parseResult.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return res
        .status(400)
        .send({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: { email, firstName, lastName, password: hashedPassword },
    });

    const { accessToken, refreshToken } = generateTokens({ id: newUser.id });

    return res.status(201).send({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message:
        'Cannot register a new user at the moment. Please try again later.',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).send({ message: parseResult.error });
  }

  const { email, password } = parseResult.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true, id: true },
    });

    if (!user) {
      return res.status(400).send({ message: 'Invalid email or password.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).send({ message: 'Invalid email or password.' });
    }

    const { accessToken, refreshToken } = generateTokens({ id: user.id });

    return res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: 'Cannot login at the moment. Please try again later.',
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.sub.id;

  const query = (req.query.search ?? '') as string;
  const offset = parseInt(req.query.offset as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const totalCount = await prisma.user.count({
      where: {
        id: { not: userId },
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    const users = await prisma.user.findMany({
      skip: (offset - 1) * limit,
      take: limit,
      where: {
        id: { not: userId },
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    const totalPages = Math.ceil(totalCount / limit);
    const next = offset + 1;
    const previous = offset - 1;

    return res.status(200).json({
      users,
      meta: {
        totalPages,
        totalCount,
        current: offset,
        next: next > totalPages ? null : next,
        previous: previous || null,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: 'Cannot retrieve users at the moment. Please try again later.',
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<any> => {
  const id = Number(req.sub);

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: 'Cannot retrieve user at the moment. Please try again later.',
    });
  }
};
