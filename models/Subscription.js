// models/Subscription.ts
import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	plan: { type: String, required: true },
	description: { type: String },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	status: { type: String, enum: ['active', 'expired'], default: 'active' },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
