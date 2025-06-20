// models/Chat.ts
import mongoose, { Schema } from 'mongoose';

const ChatSchema = new Schema(
	{
		chatName: {
			type: String,
			required: true,
		},
		isGroupChat: {
			type: Boolean,
			default: false,
		},
		meetingId: {
			type: Schema.Types.ObjectId,
			ref: 'Meeting',
		},
		latestMessage: {
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
		groupAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		participants: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		timestamps: true,
	}
);

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
