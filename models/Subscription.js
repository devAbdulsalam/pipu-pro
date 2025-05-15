// models/Subscription.ts
import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	planId: { type: String, ref: 'subscriptionPlan', required: true },
	paymentId: { type: String, ref: 'Payment', required: true },
	description: { type: String },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	status: { type: String, enum: ['active', 'expired'], default: 'active' },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
