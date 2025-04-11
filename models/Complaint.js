// models/Complaint.ts
import mongoose, { Schema } from 'mongoose';

const ComplaintSchema = new Schema({
	companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
	subject: { type: String, required: true },
	channel: { type: String },
});

export const Complaint = mongoose.model('Complaint', ComplaintSchema);
