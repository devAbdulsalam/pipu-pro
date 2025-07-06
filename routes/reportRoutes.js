import express from 'express';
import {
	reportIssue,
	getReports,
	getReport,
	replyReport,
	editReport,
	handleReport,
} from '../controllers/support.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';
const router = express.Router();
router.get('/', requireAuth, getReports);
router.get('/:id', requireAuth, getReport);
router.post('/', requireAuth, reportIssue);
router.post('/:id/reply', requireAuth, replyReport);
router.patch(
	'/',
	requireAuth,
	verifyPermission(['ADMIN', 'SUPERADMIN']),
	handleReport
);
router.patch('/:id', requireAuth, editReport);

export default router;
