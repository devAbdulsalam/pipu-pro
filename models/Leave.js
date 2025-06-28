// models/Leave.ts
import mongoose, { Schema } from 'mongoose';

const leaveSchema = new Schema({
	staffId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
	companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
	days: { type: Number, required: true, default: 1 },
	title: { type: String, required: true },
	description: { type: String, required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected'],
		default: 'pending',
	},
	approval: {
		approvedBy: { type: Schema.Types.ObjectId, ref: 'Employee' },
		reason: { type: String },
	},
});

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
