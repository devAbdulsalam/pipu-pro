import express from 'express';
import {
	getSubscription,
	getSubscriptionPlans,
	subscribe,
	paystackWebhook,
} from '../controllers/general.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/subscription-plans', getSubscriptionPlans);
router.get('/subscriptions', requireAuth, getSubscription);
router.post('/subscriptions', requireAuth, subscribe);
router.post('/paystack-webhook', requireAuth, paystackWebhook);

export default router;
