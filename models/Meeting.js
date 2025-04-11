import mongoose from 'mongoose';
const MeetingSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		meetingId: {
			type: String,
			required: true,
			unique: true,
		},
		participantss: {
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
