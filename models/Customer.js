// models/Customer.js.ts
import mongoose, { Schema } from 'mongoose';

const CustomerSchema = new Schema({
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company',
		required: true,
	},
	name: { type: String, required: true },
    email: { type: String, required: true },
    dateJoined: { type: Date, default: Date.now },
    lastSignedIn: { type: Date },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',        
    },
});

export const Customer = mongoose.model('Customer', CustomerSchema);
