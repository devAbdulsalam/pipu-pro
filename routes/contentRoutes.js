import express from 'express';
import {
	getActivePageContent,
	getPageContents,
	addPage,
	addPageContent,
	deletePage,
} from '../controllers/content.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, verifyPermission(['ADMIN']), getActivePageContent);
router.get('/:name', requireAuth, verifyPermission(['ADMIN']), getPageContents);
router.post('/', addPage);
// router.post('/', requireAuth, verifyPermission(['ADMIN']), addPage);
router.post('/:id', requireAuth, verifyPermission(['ADMIN']), addPageContent);
router.delete('/', requireAuth, verifyPermission(['ADMIN']), deletePage);

export default router;
