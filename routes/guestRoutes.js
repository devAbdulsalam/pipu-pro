import express from 'express';
import {
	createVisitor,
	visitorCheckIn,
	visitorCheckOut,
	getVisitorByCode,
	getVisitorsByCompanyId,
	getVisitorById,
	getVisitors,
	getGuestAdminDashboard,
	getGuestStaffDashboard,
	getGuestHostDashboard,
	getGuestStaff,
} from '../controllers/guest.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';

const router = express.Router();

router.get(
	'/admin/dashboard',
	requireAuth,
	// verifyPermission(['ADMIN']),
	getGuestAdminDashboard
);
router.get(
	'/admin/staff',
	requireAuth,
	// verifyPermission(['ADMIN']),
	getGuestStaff
);
router.get(
	'/host/dashboard',
	requireAuth,
	// verifyPermission(['ADMIN']),
	getGuestHostDashboard
);
router.get(
	'/staff/dashboard',
	requireAuth,
	// verifyPermission(['ADMIN']),
	getGuestStaffDashboard
);
router.post('/visitors/registration', requireAuth, createVisitor);
router.get('/visitors', requireAuth, verifyPermission(['ADMIN']), getVisitors);
router.get('/visitors/:code', requireAuth, getVisitorByCode);
router.get('/visitors/:companyId', requireAuth, getVisitorsByCompanyId);
router.get('/visitors/:id', requireAuth, getVisitorById);
router.patch('/visitors/:code/check-in', requireAuth, visitorCheckIn);
router.patch('/visitors/:code/check-out', requireAuth, visitorCheckOut);

export default router;
