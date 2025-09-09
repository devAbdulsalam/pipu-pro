// routes/paymentRoutes.js
import express from 'express';
import {
	handlePaymentWebhook,
	getPaymentLink,
	verifyPayment,
} from '../controllers/payment.js';

const router = express.Router();

router.get('/verify', verifyPayment);
router.post('/webhook', handlePaymentWebhook);
router.get('/:collectionCode/:tenantCode', getPaymentLink);

export default router;
// This file defines routes for handling payment-related operations, including webhooks and payment link generation.
