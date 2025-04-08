import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		subscription: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subscription',
			required: true,
		},
		amount: Number,
		date: Date,
		receiptUrl: String,
	},

	{ timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
