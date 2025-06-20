import express from 'express';
import {
	getAccounts,
	getDashboard,
	getFinances,
	updateSubscriptionPrices,
	createSubscriptionPlan,
	getSubscriptionPrices,
	getSubscription,
	getSubscriptions,
	getAdmins,
	getConflictTickets,
	getApprovals,
	getRoles,
	getRole,
	addRole,
	updateRole,
} from '../controllers/pipupro.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, verifyPermission(['ADMIN']), getDashboard);
router.get('/accounts', requireAuth, verifyPermission(['ADMIN']), getAccounts);
router.get('/finances', requireAuth, getFinances);
router.get('/subscriptions', requireAuth, getSubscriptions);
router.get('/subscriptions/:id', requireAuth, getSubscription);
router.get('/subscription-prices', requireAuth, getSubscriptionPrices);
router.patch(
	'/update-subscription-prices',
	requireAuth,
	updateSubscriptionPrices
);
router.post('/subscription-plans', requireAuth, createSubscriptionPlan);
router.get('/roles', requireAuth, getRoles);
router.get('/roles/:id', requireAuth, getRole);
router.post('/roles', requireAuth, addRole);
router.patch('/roles', requireAuth, updateRole);
router.get('/conflicts', requireAuth, getConflictTickets);
router.get('/approvals', requireAuth, getApprovals);
router.get('/admins', requireAuth, getAdmins);
// router.post('/conflicts', requireAuth, addConflict);

export default router;
