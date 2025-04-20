import mongoose from 'mongoose';
const subscriptionPlanSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
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
		duration: {
			type: Number,
			required: true,
			default: 30, // default duration in days
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
		},
	},

	{ timestamps: true }
);

const subscriptionPlan = mongoose.model(
	'subscriptionPlan',
	subscriptionPlanSchema
);

export default subscriptionPlan;
