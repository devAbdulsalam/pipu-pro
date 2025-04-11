// models/Visitor.ts
import mongoose, { Schema } from 'mongoose';

const VisitorSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String },
	phone: { type: String },
	dueDate: { type: Date },
	status: {
		type: String,
		enum: ['in-active', 'active', 'expired'],
		default: 'in-active',
	},
});

export const Visitor = mongoose.model('Visitor', VisitorSchema);
