// models/Activity.ts
import mongoose, { Schema } from 'mongoose';

const VisitorLogSchema = new Schema(
	{
		ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		visitorId: { type: Schema.Types.ObjectId, ref: 'Visitor', required: true },
		status: { type: String, enum: ['checkOut', 'checkIn'], required: true },
	},
	{ timestamps: true }
);

export const VisitorLog = mongoose.model('VisitorLog', VisitorLogSchema);
export default VisitorLog;
