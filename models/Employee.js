// models/Employee.ts
import mongoose, { Schema } from 'mongoose';

const employeeSchema = new Schema({
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: { type: String, required: true },
	email: { type: String, unique: true },
	position: { type: String, required: true },
	department: { type: String },
	salary: { type: Number,  },
	status: {
		type: String,
		enum: ['active', 'inactive', 'suspended', 'retired'],
		default: 'inactive',
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