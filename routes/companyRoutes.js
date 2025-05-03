import express from 'express';
import {
    getDashboard,
    getStaffs,
    getStaff,
	getLeaves,
	getLeavesRequest,
	payrollDashboard,
	payroll,
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
router.get('/payroll', requireAuth, payrollDashboard);
router.get('/payroll/:id', requireAuth, payroll);
// router.get('/subscription-prices', requireAuth, getSubscriptionPrices);
// router.patch('/update-subscription-prices', requireAuth, updateSubscriptionPrices);
// router.post('/subscription-plans', requireAuth, createSubscriptionPlan);

export default router;
