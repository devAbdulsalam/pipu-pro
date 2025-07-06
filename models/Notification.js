import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema(
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

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
