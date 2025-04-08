// models/Leave.ts
import mongoose, { Schema } from 'mongoose';

const leaveSchema = new Schema({
	employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected'],
		default: 'pending',
	},
});

export const Leave = mongoose.model('Leave', leaveSchema);
