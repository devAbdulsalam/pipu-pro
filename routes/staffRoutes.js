import express from 'express';
import {
	getDashboard,
	getAttendance,
	markAttendance,
	checkOutAttendance,
} from '../controllers/staff.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';

const router = express.Router();

router.get(
	'/dashboard',
	requireAuth,
	verifyPermission(['STAFF']),
	getDashboard
);
router.get('/attendance', requireAuth, verifyPermission(['STAFF']), getAttendance);
router.post('/attendance', requireAuth, verifyPermission(['STAFF']), markAttendance);
router.patch(
	'/attendance',
	requireAuth,
	verifyPermission(['STAFF']),
	checkOutAttendance
);

export default router;
