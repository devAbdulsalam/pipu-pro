import express from 'express';
import {
	getDashboard,
	createCompany,
	updateCompany,
	addRole,
	getRole,
	getRoles,
	updateRole,
	getStaffs,
	addStaff,
	getStaff,
	getLeaves,
	getLeavesRequest,
	getBoardRooms,
	createTicket,
	getTickets,
	getTicket,
	updateTicket,
} from '../../controllers/company/company.js';
import {
	requireAuth,
	verifyPermission,
	isCompany,
} from '../../middleware/requireAuth.js';
import policyRoutes from './policy.js';
import departmentRroutes from './department.js';
import payrollRroutes from './payroll.js';

const router = express.Router();

router.get(
	'/dashboard',
	requireAuth,
	verifyPermission(['COMPANY']),
	isCompany,
	getDashboard
);
router.post('/', createCompany);
router.patch(
	'/',
	requireAuth,
	verifyPermission(['COMPANY']),
	isCompany,
	updateCompany
);
router.get(
	'/roles',
	requireAuth,
	verifyPermission(['COMPANY']),
	isCompany,
	getRoles
);
router.get('/roles/:id', requireAuth, verifyPermission(['COMPANY']), getRole);
router.post('/roles', requireAuth, verifyPermission(['COMPANY']), addRole);
router.patch('/roles', requireAuth, verifyPermission(['COMPANY']), updateRole);
router.get(
	'/staffs',
	requireAuth,
	verifyPermission(['COMPANY']),
	isCompany,
	getStaffs
);
router.post('/staffs', requireAuth, verifyPermission(['COMPANY']), addStaff);
router.get('/staffs/:id', requireAuth, verifyPermission(['COMPANY']),  getStaff);
router.get(
	'/leaves',
	requireAuth,
	verifyPermission(['COMPANY']),
	isCompany,
	getLeaves
);
router.get('/leaves/:id', requireAuth, getLeavesRequest);
router.get('/boardrooms', requireAuth, getBoardRooms);
router.get(
	'/tickets',
	requireAuth,
	verifyPermission(['COMPANY']),
	isCompany,
	getTickets
);
router.get('/tickets/:id', requireAuth, getTicket);
router.post('/tickets', requireAuth, createTicket);
router.patch('/tickets', requireAuth, updateTicket);
router.use(requireAuth, verifyPermission(['COMPANY']), payrollRroutes);
router.use(requireAuth, verifyPermission(['COMPANY']), policyRoutes);
router.use(requireAuth, verifyPermission(['COMPANY']), departmentRroutes);

export default router;
