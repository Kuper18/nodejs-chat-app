import express from 'express';

import { getAllUsers, getMe, login, signup } from '../controllers/users';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getAllUsers);
router.get('/me', auth, getMe);
router.post('/signup', signup);
router.post('/login', login);

export default router;
