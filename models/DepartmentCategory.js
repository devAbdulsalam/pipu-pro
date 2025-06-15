import mongoose, { Schema } from 'mongoose';

const DepartmentCategorySchema = new Schema(
	{
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		name: { type: String, required: true },
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
			required: true,
		},
	},
	{ timestamps: true }
);

const DepartmentCategory = mongoose.model(
	'DepartmentCategory',
	DepartmentCategorySchema
);
export default DepartmentCategory;
