import mongoose from 'mongoose';
const AnnouncementSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ['dues', 'announcement', 'issues'],
			default: 'announcement',
		},
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: false,
		},
		title: { type: String, required: false },
		message: { type: String, required: true },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export default Announcement;
