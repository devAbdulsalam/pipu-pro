import mongoose from 'mongoose';

const SupportSchema = new mongoose.Schema(
	{
		reportedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
		},
		reason: { type: String, required: true },
		category: { type: String, required: true },
		status: {
			type: String,
			enum: ['pending', 'resolved', 'inprogress', 'deleted'],
			default: 'pending',
		},
		replies: [
			{
				from: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				message: String,
				status: String,
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

const Support = mongoose.model('Support', SupportSchema);
export default Support;
