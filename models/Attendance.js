// models/Attendance.ts
import mongoose, { Schema } from 'mongoose';

const attendanceSchema = new Schema({
	companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
	employeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	checkIn: { type: Date },
	checkOut: { type: Date },
	category: { type: String},
	status: {
		type: String,
		enum: ['ontime', 'absent', 'late', 'absent'],
		default: 'ontime',
	},
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
