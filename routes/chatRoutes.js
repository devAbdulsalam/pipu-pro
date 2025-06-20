import express from 'express';
import {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
	deleteGroup,
	fetchGroupChats,
} from '../controllers/chat.js';
import { requireAuth } from '../middleware/requireAuth.js';


const router = express.Router();

// create chat between to people
router.post('/', requireAuth, accessChat);
// fetch chat between to people
router.get('/', requireAuth, fetchChats);
router.get('/group', requireAuth, fetchGroupChats);
router.post('/group', requireAuth, createGroupChat);
router.post('/group/add', requireAuth, addToGroup);
router.post('/group/remove', requireAuth, removeFromGroup);
router.post('/group/rename',requireAuth, renameGroup);
router.delete('/:chatId', requireAuth, deleteGroup);
// router.route('/').delete(requireAuth, deleteGroup);

export default router;
