import express from 'express';
import { allMessages, sendMessage } from '../controllers/message.js';

import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/:chatId', requireAuth, allMessages);
router.post('/', requireAuth, sendMessage);

export default router;
