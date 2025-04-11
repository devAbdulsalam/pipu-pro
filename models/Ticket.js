// models/Ticket.ts
import mongoose, { Schema } from 'mongoose';

const TicketSchema = new Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
	title: { type: String, required: true },
	type: { type: String },
	client: { type: String },
	message: { type: String },
	assignedTo: [
		{ type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    ],
    tags: [String],
	priority: {
		type: String,
		enum: ['low', 'medium', 'high'],
		default: 'medium',
	},
	status: {
		type: String,
		enum: ['pending', 'in-progress', 'unresolved','completed'],
		default: 'pending',
	},
});

export const Ticket = mongoose.model('Ticket', TicketSchema);
