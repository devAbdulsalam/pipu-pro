import mongoose, { Schema } from 'mongoose';

const salarySchema = new Schema(
	{
		ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		employeeId: {
			type: Schema.Types.ObjectId,
			ref: 'Employee',
			required: true,
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		basicSalary: {
			type: Number,
			required: true,
		},
		bonus: {
			type: Number,
			default: 0,			
		},
		deductions: {
			type: Number,
			default: 0,
		},
		tax: {
			type: Number,
			default: 0,			
		},

	},
	{ timestamps: true }
);

const Salary = mongoose.model('Salary', salarySchema);
export default Salary;
