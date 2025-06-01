import mongoose from 'mongoose';
const MeetingSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: String,
		maxUsers: { type: Number, default: 10 },
		users: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				socketId: String,
				name: String,
				isAudioEnabled: Boolean,
				isVideoEnabled: Boolean,
				joinedAt: { type: Date, default: Date.now },
			},
		],
		meetingId: {
			type: String,
			required: true,
			unique: true,
		},
		participants: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'User',
		},
		host: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		accessType: {
			type: String,
			default: 'private',
			enum: ['public', 'private'],
		},
		passCode: {
			type: String,
		},
		date: {
			type: Date,
		},
		startTime: {
			type: Date,
		},
		duration: { type: Number, default: 10 }, // in minutes
	},
	{ timestamps: true }
);

const Meeting = mongoose.model('Meeting', MeetingSchema);

export default Meeting;
