// models/Activity.ts
import mongoose, { Schema } from 'mongoose';

const CompanyRoleSchema = new Schema(
	{
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		name: {
			type: String,
			min: 2,
			max: 100,
			required: true,
			trim: true,
		},
		description: {
			type: String,
		},
		permissions: [
			{
				name: {
					type: String,
					required: true,
				},
				isAllowed: {
					type: Boolean,
					required: true,
					default: true,
				},
			},
		],
	},
	{ timestamps: true }
);

const CompanyRole = mongoose.model('CompanyRole', CompanyRoleSchema);
export default CompanyRole;
