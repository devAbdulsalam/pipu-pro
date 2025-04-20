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

const Complaint = mongoose.model('Complaint', ComplaintSchema);
export default Complaint;