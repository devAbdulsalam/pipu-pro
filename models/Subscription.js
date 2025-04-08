// models/Subscription.ts
import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	plan: { type: String, required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	status: { type: String, enum: ['active', 'expired'], default: 'active' },
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
