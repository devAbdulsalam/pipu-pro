import mongoose from 'mongoose';
const planSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		features: {
			type: [String],
			required: true,
		},
		billingCycle: {
			type: String,
			enum: ['monthly', 'yearly'],
			required: true,
		},
	},

	{ timestamps: true }
);

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
