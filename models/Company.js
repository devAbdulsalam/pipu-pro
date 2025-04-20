// models/Company.ts
import mongoose, { Schema } from 'mongoose';

const CompanySchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
});

const Company = mongoose.model('Company', CompanySchema);
export default Company;
