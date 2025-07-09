import mongoose, { Schema } from 'mongoose';

const PayrollSchema = new mongoose.Schema(
	{
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},

		status: {
			type: String,
			enum: ['pending', 'paid', 'draft'],
			default: 'pending',
		},

		approval: {
			approvedBy: { type: Schema.Types.ObjectId, ref: 'Employee' },
			reason: { type: String },
			approvedAt: { type: Date },
		},

		employees: [
			{
				employeeId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Employee',
					required: true,
				},
				amount: { type: Number, required: true },
				dateProcessed: { type: Date, required: true },
			},
		],
	},
	{ timestamps: true }
);


const Payslip = mongoose.model('Payslip', PayslipSchema);
export default Payslip;
