// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
	{
		collectionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Collection',
			required: true,
		},
		tenantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tenant',
		},
		phone: String,
		email: String,
		amount: {
			type: Number,
			required: true,
		},
		paymentMethod: {
			type: String,
			enum: ['card', 'bank_transfer', 'wallet'],
		},
		status: {
			type: String,
			enum: ['pending', 'success', 'failed', 'refunded'],
			default: 'pending',
		},
		transactionReference: {
			type: String,
			unique: true,
		},
		paymentGateway: {
			type: String,
			enum: ['paystack', 'flutterwave'],
		},
		receiptUrl: String,
		metadata: mongoose.Schema.Types.Mixed,
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Payment', paymentSchema);
