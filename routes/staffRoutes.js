import express from 'express';
import {
	getDashboard,
	getAttendance,
	markAttendance,
	checkOutAttendance,getMyLeaveRequest,
	sendLeaveRequest,
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
} from '../controllers/staff.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';

const router = express.Router();

router.get(
	'/dashboard',
	requireAuth,
	verifyPermission(['STAFF']),
	getDashboard
);
router.get(
	'/payroll',
	requireAuth,
	verifyPermission(['STAFF']),
	getMyPayroll
);
router.get('/attendance', requireAuth, verifyPermission(['STAFF']), getAttendance);
router.post('/attendance', requireAuth, verifyPermission(['STAFF']), markAttendance);
router.patch(
	'/attendance',
	requireAuth,
	verifyPermission(['STAFF']),
	checkOutAttendance
);
router.get(
	'/leaves',
	requireAuth,
	verifyPermission(['STAFF']),
	getMyLeaveRequest
);
router.post(
	'/leaves',
	requireAuth,
	verifyPermission(['STAFF']),
	sendLeaveRequest
);
router.get(
	'/visitors',
	requireAuth,
	verifyPermission(['STAFF']),
	getVisitors
);
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
	getComplaints
);
router.get(
	'/meetings',
	requireAuth,
	verifyPermission(['STAFF']),
	getMeetings
);
router.get(
	'/tickets',
	requireAuth,
	verifyPermission(['STAFF']),
	getTickets
);
router.get('/tickets/:id',
	requireAuth,
	verifyPermission(['STAFF']),
	getTicket);
router.post('/tickets',
	requireAuth,
	verifyPermission(['STAFF']),
	createTicket);
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
