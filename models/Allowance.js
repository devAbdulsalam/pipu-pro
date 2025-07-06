// models/Activity.ts
import mongoose, { Schema } from 'mongoose';

const allowanceSchema = new Schema(
	{
		ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		benefits: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Benefits',
			},
		],
		status: {
			type: String,
			enum: ['pending', 'paid', 'draft'],
			default: 'pending',
		},
	},
	{ timestamps: true }
);

const Allowance = mongoose.model('Allowance', allowanceSchema);
export default Allowance;
