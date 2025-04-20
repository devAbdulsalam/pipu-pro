// models/Visitor.ts
import mongoose, { Schema } from 'mongoose';

const VisitorSchema = new Schema(
	{
		organizationId: { type: String, required: true },
		name: { type: String, required: true },
		email: { type: String },
		phone: { type: String },
		code: { type: String },
		entryType: {
			type: String,
			enum: ['single', 'multiple', 'infinity'],
			default: 'infinity',
		},
		maxAccess: { type: Number, default: 10000000000 },
		expirationTime: {
			type: Date,
			required: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		checkIn: { type: Date },
		checkOut: { type: Date },
		status: {
			type: String,
			enum: ['in-active', 'active', 'suspend', 'expired'],
			default: 'in-active',
		},
	},
	{ timestamps: true }
);

const Visitor = mongoose.model('Visitor', VisitorSchema);
export default Visitor;
