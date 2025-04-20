import express from 'express';
import {
	getAccounts,
	getDashboard,
	getFinances,
	updateSubscriptionPrices,
	createSubscriptionPlan,
	getSubscriptionPrices,
} from '../controllers/pipupro.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, verifyPermission(['ADMIN']), getDashboard);
router.get('/accounts', requireAuth, verifyPermission(['ADMIN']), getAccounts);
router.get('/finances', requireAuth, getFinances);
router.get('/subscription-prices', requireAuth, getSubscriptionPrices);
router.patch('/update-subscription-prices', requireAuth, updateSubscriptionPrices);
router.post('/subscription-plans', requireAuth, createSubscriptionPlan);
// router.post('/', requireAuth, createVisitor);
// router.get('/:companyId', requireAuth, getVisitorsByCompanyId);
// router.get('/:id', requireAuth, getVisitorById);
// router.patch('/:code/check-in', requireAuth, visitorCheckIn);
// router.patch('/:code/check-out', requireAuth, visitorCheckOut);

export default router;
