// models/SalaryStructure.ts
import mongoose, { Schema } from 'mongoose';

const componentSchema = new Schema(
	{
		name: { type: String, required: true }, // e.g., 'Housing', 'Transport'
		amount: { type: Number, required: true },
		type: { type: String, enum: ['fixed', 'percentage'], default: 'fixed' },
	},
	{ _id: false }
);

const salaryStructureSchema = new Schema(
	{
		ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		basicSalary: { type: Number, required: true },
		allowances: [componentSchema],
		deductions: [componentSchema],
		tax: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const SalaryStructure = mongoose.model(
	'SalaryStructure',
	salaryStructureSchema
);
export default SalaryStructure;


// {
// 	"ownerId": "user_id_here",
// 	"companyId": "company_id_here",
// 	"basicSalary": 50000,
// 	"allowances": [
// 	  { "name": "Transport", "amount": 10000, "type": "fixed" },
// 	  { "name": "Medical", "amount": 10, "type": "percentage" }
// 	],
// 	"deductions": [
// 	  { "name": "Pension", "amount": 5, "type": "percentage" }
// 	],
// 	"tax": 5
//   }
  