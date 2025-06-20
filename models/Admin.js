// models/Admin.ts
import mongoose, { Schema } from 'mongoose';

const AdminSchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: { type: String, required: true },
	email: { type: String, unique: true },
	position: { type: String, required: true },
	department: { type: String },
	salary: { type: Number },
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

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
