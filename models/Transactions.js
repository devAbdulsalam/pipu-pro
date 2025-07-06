import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		refId: {
			type: String,
			required: true,
		},
		subscription: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subscription',
			required: true,
		},
		amount: Number,
		receiptUrl: String,
		status: {
			type: String,
			enum: ['pending', 'processing', 'paid'],
			required: true,
		},
		resolvedAt: { type: Date },
	},
	{ timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
