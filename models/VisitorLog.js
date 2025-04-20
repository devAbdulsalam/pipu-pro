// models/Activity.ts
import mongoose, { Schema } from 'mongoose';

const VisitorLogSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'Visitor', required: true },
		checkIn: { type: Date },
		checkOut: { type: Date },
	},
	{ timestamps: true }
);

export const VisitorLog = mongoose.model(
	'VisitorLog',
	VisitorLogSchema
);
export default VisitorLog;
