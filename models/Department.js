// models/Activity.ts
import mongoose, { Schema } from 'mongoose';

const DepartmentSchema = new Schema(
	{
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'DepartmentCategory',
			required: true,
		},
		minSalary: {
			type: String,
		},
		maxSalary: {
			type: String,
		},
		overTimeRate: {
			type: String,
		},
		geoClockIn: {
			type: Boolean,
			default: false,
		},
		workModel: {
			type: String,
			default: 'onsite',
			enum: ['onsite', 'hybrid', 'remote'],
		},
		workDays: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Department = mongoose.model('Department', DepartmentSchema);
export default Department;
