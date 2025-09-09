// controllers/paymentController.js
import Payment from '../models/Payment.js';
import Collection from '../models/Collection.js';
import Tenant from '../models/Tenant.js';
import { processPayment } from '../utils/paymentProcessor.js';
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
					apartmentUnit: tenant.apartmentUnit,
				},
				paymentLink: tenant.paymentLink,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
