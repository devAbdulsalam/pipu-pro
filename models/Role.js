// models/Activity.ts
import mongoose, { Schema } from 'mongoose';

const RoleSchema = new Schema(
	{
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

const Role = mongoose.model('Role', RoleSchema);
export default Role;
