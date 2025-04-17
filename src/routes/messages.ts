import express from 'express';

import { createMessage, getMessages } from '../controllers/messages';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/:roomId', auth, getMessages);
router.post('/', auth, createMessage);

export default router;
