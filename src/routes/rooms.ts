import express from 'express';

import { createRoom, getRoom } from '../controllers/rooms';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getRoom);
router.post('/', auth, createRoom);

export default router;
