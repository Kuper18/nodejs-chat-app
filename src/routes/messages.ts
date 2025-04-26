import express from 'express';

import {
  createMessage,
  getMessages,
  getUnreadMessagesCount,
  readMessage,
  updateMessage,
} from '../controllers/messages';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/unread-counts', auth, getUnreadMessagesCount);
router.get('/:roomId', auth, getMessages);
router.post('/', auth, createMessage);
router.patch('/read/:messageId', auth, readMessage);
router.patch('/:messageId', auth, updateMessage);

export default router;
