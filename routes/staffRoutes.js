import express from 'express';
import {
	getDashboard,
	getAttendance,
	markAttendance,
	clockOutAttendance,
	getMyLeaveRequest,
	sendLeaveRequest,
	updateLeaveRequest,
	getTickets,
	updateTicket,
	createTicket,
	getTicket,
	getTasks,
	updateTask,
	createTask,
	getTask,
	getVisitors,
	getCustomers,
	getMeetings,
	getComplaints,
	getMyPayroll,
	getMyPayrollHistory,
	getSalary,
} from '../controllers/staff.js';
import {
	requireAuth,
	verifyPermission,
	isStaff,
} from '../middleware/requireAuth.js';

const router = express.Router();

router.get(
	'/dashboard',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	getDashboard
);
router.get(
	'/payroll',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	getMyPayroll
);
router.get(
	'/payroll-history',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	getMyPayrollHistory
);
router.get(
	'/salary',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	getSalary
);
router.get(
	'/attendance',
	requireAuth,
	verifyPermission(['STAFF']),
	getAttendance
);
router.post(
	'/attendance',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	markAttendance
);
router.patch(
	'/attendance',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	clockOutAttendance
);
router.get(
	'/leaves',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	getMyLeaveRequest
);
router.post(
	'/leaves',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	sendLeaveRequest
);
router.patch(
	'/leaves',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	updateLeaveRequest
);
router.get('/visitors', requireAuth, verifyPermission(['STAFF']), getVisitors);
router.get(
	'/customers',
	requireAuth,
	verifyPermission(['STAFF']),
	getCustomers
);
router.get(
	'/complaints',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	getComplaints
);
router.get('/meetings', requireAuth, verifyPermission(['STAFF']), getMeetings);
router.get(
	'/tickets',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	getTickets
);
router.get('/tickets/:id', requireAuth, verifyPermission(['STAFF']), getTicket);
router.post(
	'/tickets',
	requireAuth,
	verifyPermission(['STAFF']),
	isStaff,
	createTicket
);
router.patch(
	'/tickets',
	requireAuth,
	verifyPermission(['STAFF']),
	updateTicket
);
router.get('/tasks', requireAuth, verifyPermission(['STAFF']), getTasks);
router.get('/tasks/:id', requireAuth, verifyPermission(['STAFF']), getTask);
router.post('/tasks', requireAuth, verifyPermission(['STAFF']), createTask);
router.patch('/tasks', requireAuth, verifyPermission(['STAFF']), updateTask);

export default router;
