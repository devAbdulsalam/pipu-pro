// models/Task.ts
import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	assignedTo: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
	dueDate: { type: Date },
	status: {
		type: String,
		enum: ['pending', 'in-progress', 'completed'],
		default: 'pending',
	},
});

export const Task = mongoose.model('Task', taskSchema);
