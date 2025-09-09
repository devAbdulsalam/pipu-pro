// controllers/paymentController.js
import Payment from '../models/Payment.js';
import Collection from '../models/Collection.js';
import {
	processPayment,
	verifyPaystackPayment,
} from '../utils/paymentProcessor.js';
import { sendReceipt } from '../utils/notificationService.js';

export const handlePaymentWebhook = async (req, res) => {
	try {
		const { event, data } = req.body;

		if (event === 'charge.success') {
			const payment = await Payment.findOne({
				transactionReference: data.reference,
			});

			if (payment && payment.status === 'pending') {
				payment.status = 'success';
				payment.receiptUrl = data.receipt_url;
				await payment.save();

				// Update collection totals
				await Collection.findByIdAndUpdate(payment.collectionId, {
					$inc: { totalReceived: payment.amount },
				});

				// Update tenant status
				await Collection.updateOne(
					{
						_id: payment.collectionId,
						'tenants.uniqueCode': payment.metadata?.uniqueCode,
					},
					{ $set: { 'tenants.$.status': 'paid' } }
				);

				// Send receipt
				await sendReceipt(payment.phone, payment.email, payment);
			}
		}

		res.status(200).send('Webhook processed');
	} catch (error) {
		console.error('Webhook error:', error);
		res.status(500).send('Webhook processing failed');
	}
};

export const getPaymentLink = async (req, res) => {
	try {
		const { collectionCode, tenantCode } = req.params;

		const collection = await Collection.findOne({ collectionCode }).populate(
			'tenants.tenantId'
		);

		const tenant = collection.tenants.find((t) => t.uniqueCode === tenantCode);

		if (!tenant) {
			return res
				.status(404)
				.json({ success: false, message: 'Payment link not found' });
		}

		res.json({
			success: true,
			data: {
				title: collection.title,
				amount: tenant.amountDue,
				dueDate: collection.dueDate,
				tenant: {
					name: tenant.tenantId?.name,
					email: tenant.tenantId?.email,
					apartmentUnit: tenant.apartmentUnit,
				},
				paymentLink: tenant.paymentLink,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const initializePayment = async (req, res) => {
	try {
		const paymentData = req.body;
		const result = await processPayment(paymentData);
		console.log('result', result);
		if (result.success) {
			res.status(200).json({ success: true, data: result });
		} else {
			res.status(400).json({ success: false, message: result.error });
		}
	} catch (error) {
		console.error('Error in initializePayment:', error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export const verifyPayment = async (req, res) => {
	try {
		const { reference } = req.body;
		const payment = await verifyPaystackPayment(reference);

		if (payment.success) {
			res.status(200).json({ success: true, data: payment.data });
		} else {
			res.status(400).json({ success: false, message: payment.error });
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
