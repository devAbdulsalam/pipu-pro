import express from 'express';
import {
	getActivePageContent,
	getPageContents,
	getPageByName,
	addPage,
	addPageContent,
	deletePage,
	getPageById,
	updatePageContent,
} from '../controllers/content.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, getActivePageContent);
router.get('/admin', requireAuth, verifyPermission(['ADMIN']), getPageContents);
router.get('/admin/:id',requireAuth, verifyPermission(['ADMIN']), getPageById);
router.post('/:name', getPageByName);
router.post('/admin', verifyPermission(['ADMIN']), addPage);
router.post('/admin', requireAuth, verifyPermission(['ADMIN']), addPage);
router.patch(
	'/admin',
	requireAuth,
	verifyPermission(['ADMIN']),
	updatePageContent
);
router.patch(
	'/admin/:id',
	requireAuth,
	verifyPermission(['ADMIN']),
	addPageContent
);
router.delete(
	'/admin/:id',
	requireAuth,
	verifyPermission(['ADMIN']),
	deletePage
);

export default router;
