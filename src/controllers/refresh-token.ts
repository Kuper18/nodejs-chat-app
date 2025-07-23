import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { REFRESH_TOKEN_SECRET } from '../constants';
import { generateTokens } from '../services/auth';

const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      typeof decoded.id === 'number'
    ) {
      const { accessToken } = generateTokens({ id: decoded.id });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).send({ accessToken });
    } else {
      res.status(400).send({ message: 'Invalid refresh token payload.' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: 'Refresh token is expired.' });
  }
};

export default refreshToken;
