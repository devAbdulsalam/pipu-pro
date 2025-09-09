// routes/paymentRoutes.js
import express from 'express';
import {
	handlePaymentWebhook,
	getPaymentLink,
} from '../controllers/payment.js';
import {
	initializePaystackPayment,
	verifyPaystackPayment,
} from '../utils/paymentProcessor.js';

const router = express.Router();

router.post('/initilize', initializePaystackPayment);
router.post('/verify', verifyPaystackPayment);
router.post('/webhook/payment', handlePaymentWebhook);
router.get('/:collectionCode/:tenantCode', getPaymentLink);

export default router;
// This file defines routes for handling payment-related operations, including webhooks and payment link generation.
