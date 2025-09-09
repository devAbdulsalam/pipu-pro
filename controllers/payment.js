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
		const paymentData = {
			email: tenant.tenantId?.email,
			amount: tenant.amountDue,
		};
		const result = await processPayment(paymentData);
		console.log('result', result);
		if (result.success) {
			const payment = await Payment.create({
				collectionId: collection._id,
				amount: tenant.amountDue,
				tenantId: tenant.tenantId?._id,
				email: tenant.tenantId?.email,
				phone: tenant.tenantId?.phone,
				paymentGateway: result?.data?.gateway,
			});
			res.status(200).json({
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
					paymentUrl: result.paymentUrl,
					reference: result.reference,
					accessCode: result.access_code,
					paymentId: payment._id,
				},
			});
		} else {
			res.status(400).json({ success: false, message: result.error });
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const verifyPayment = async (req, res) => {
	try {
		const { reference } = req.params;
		const isPayment = await verifyPaystackPayment(reference);

		console.log('payment', isPayment);

		if (isPayment.success) {
			const payment = await Payment.findOneAndUpdate(
				{
					transactionReference: isPayment.data.reference,
				},
				{
					status: 'success',
					receiptUrl: isPayment.data.receipt_url,
				},
				{ new: true }
			);

			if (payment) {
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
			res.status(200).json({ success: true, data: isPayment.data });
		} else {
			res.status(400).json({ success: false, message: isPayment.error });
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
