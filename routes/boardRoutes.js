import express from 'express';
import { getSubscriptionPlans } from '../controllers/general.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/subscription-plans', getSubscriptionPlans);

export default router;
