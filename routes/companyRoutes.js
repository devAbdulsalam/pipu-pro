import express from 'express';
import {
	getDashboard,
	getStaffs,
	addStaff,
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
	createCompany,
	createTicket,
	getTickets,
	getTicket,
	updateTicket,
} from '../controllers/company.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/', createCompany);
router.get(
	'/dashboard',
	requireAuth,
	verifyPermission(['COMPANY']),
	getDashboard
);
router.get('/staffs', requireAuth, verifyPermission(['COMPANY']), getStaffs);
router.post('/staffs', requireAuth, verifyPermission(['COMPANY']), addStaff);
router.get('/staffs/:id', requireAuth, verifyPermission(['COMPANY']), getStaff);
router.get('/leaves', requireAuth, verifyPermission(['COMPANY']), getLeaves);
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
router.get('/tickets', requireAuth, getTickets);
router.get('/tickets/:id', requireAuth, getTicket);
router.post('/tickets', requireAuth, createTicket);
router.patch('/tickets', requireAuth, updateTicket);

export default router;
