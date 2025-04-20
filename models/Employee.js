// models/Employee.ts
import mongoose, { Schema } from 'mongoose';

const employeeSchema = new Schema({
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	role: { type: String, required: true },
	department: { type: String, required: true },
	salary: { type: Number, required: true },
	status: {
		type: String,
		enum: ['active', 'inactive', 'suspended', 'retired'],
		default: 'in-active',
	},
	skills: [String],
	phone: { type: String },
	address: { type: String },
	joiningDate: { type: Date },
	education: { type: String },
	employmentType: { type: String },
	emergencyContact: {
		name: { type: String },
		phone: { type: String },
		relation: { type: String },
	},
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;