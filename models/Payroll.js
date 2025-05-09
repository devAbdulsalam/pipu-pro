import mongoose from 'mongoose';
const PayrollSchema = new mongoose.Schema(
	{
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'paid'],
			default: 'pending',
		},
		employes: [
			{
				employeeId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				amount: {
					type: Number,
					required: true,
				},
				dateProcessed: {
					type: Date,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

const Payroll = mongoose.model('Payroll', PayrollSchema);

export default Payroll;
