// models/Attendance.ts
import mongoose, { Schema } from 'mongoose';

const attendanceSchema = new Schema({
	employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
	clockIn: { type: Date, required: true },
	clockOut: { type: Date },
});

export const Attendance = mongoose.model('Attendance', attendanceSchema);
