// models/Activity.ts
import mongoose, { Schema } from 'mongoose';

const salaryStructureSchema = new Schema(
	{
		ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
	},
	{ timestamps: true }
);

const SalaryStructure = mongoose.model(
	'SalaryStructure',
	salaryStructureSchema
);
export default SalaryStructure;
