import { Router } from 'express';
import {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
	deleteGroup,
} from '../controllers/chat.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// create chat between to people
router.route('/').post(protect, accessChat);
// fetch chat between to people
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/group/add').post(protect, addToGroup);
router.route('/group/remove').post(protect, removeFromGroup);
router.route('/group/rename').put(protect, renameGroup);
router.route('/:chatId').delete(protect, deleteGroup);
// router.route('/').delete(protect, deleteGroup);

export default router;
