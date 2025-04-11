// models/Attendance.ts
import mongoose, { Schema } from 'mongoose';

const attendanceSchema = new Schema({
	employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
	checkIn: { type: Date, required: true },
	checkOut: { type: Date },
	status: {
		type: String,
		enum: ['ontime', 'absent', 'late'],
		default: 'ontime',
	},
});

export const Attendance = mongoose.model('Attendance', attendanceSchema);
