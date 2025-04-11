import mongoose from 'mongoose';
const PayrollSchema = new mongoose.Schema(
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
	{ timestamps: true }
);

const Payroll = mongoose.model('Payroll', PayrollSchema);

export default Payroll;
