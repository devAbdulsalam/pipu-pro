import express from 'express';
import {
	getDashboard,
	getStaffs,
	getStaff,
	getLeaves,
	getLeavesRequest,
	payrollDashboard,
	payrollHistory,
	addPayroll,
	getPayroll,
	draftPayroll,
	payrollDrafts,
	getBoardRooms,
	getMeeting,
	getMeetings,
	createMeeting,
} from '../controllers/company.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';

const router = express.Router();

router.get(
	'/dashboard',
	requireAuth,
	verifyPermission(['ADMIN']),
	getDashboard
);
router.get('/staffs', requireAuth, verifyPermission(['ADMIN']), getStaffs);
router.get('/staffs/:id', requireAuth, verifyPermission(['ADMIN']), getStaff);
router.get('/leaves', requireAuth, verifyPermission(['ADMIN']), getLeaves);
router.get('/leaves/:id', requireAuth, getLeavesRequest);
router.get('/payroll-dashboard', requireAuth, payrollDashboard);
router.get('/payroll-history', requireAuth, payrollHistory);
router.get('/payroll-drafts', requireAuth, payrollDrafts);
router.post('/payroll-drafts', requireAuth, draftPayroll);
router.get('/payrolls', requireAuth, payrollDashboard);
router.post('/payrolls', requireAuth, addPayroll);
router.get('/payrolls/:id', requireAuth, getPayroll);
router.get('/boardrooms', requireAuth, getBoardRooms);
router.get('/meetings', requireAuth, getMeeting);
router.get('/meetings/:id', requireAuth, getMeetings);
router.post('/meetings', requireAuth, createMeeting);

export default router;
