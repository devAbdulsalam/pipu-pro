// models/Employee.ts
import mongoose, { Schema } from 'mongoose';

const employeeSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	role: { type: String, required: true },
	department: { type: String, required: true },
	salary: { type: Number, required: true },
});

export const Employee = mongoose.model('Employee', employeeSchema);
