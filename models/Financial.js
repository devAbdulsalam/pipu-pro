import mongoose, { Schema } from 'mongoose';

const FinancialSchema = new Schema(
	{
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		defaultCurrency: {
			type: String,
			default: 'USD',
			required: true,
		},
		paymentFrequency: { type: String, default: 'Monthly', required: true },
		payrollApproval: {
			type: String,
			default: 'Adminstrator',
			required: true,
		},
	},
	{ timestamps: true }
);

const Financial = mongoose.model('Financial', FinancialSchema);
export default Financial;
