import mongoose from 'mongoose';
const MeetingSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},

		maxUsers: { type: Number, default: 10 },
		users: [
			{
				userId: String,
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
			type: [mongoose.Schema.Types.ObjectId],
			ref: 'User',
			required: true,
		},
		accessType: {
			type: String,
			required: true,
		},
		accessCode: {
			type: String,
			required: true,
		},
		startTime: {
			type: Date,
		},
		endTime: {
			type: Date,
		},
	},
	{ timestamps: true }
);

const Meeting = mongoose.model('Meeting', MeetingSchema);

export default Meeting;
