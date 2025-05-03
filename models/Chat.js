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
		latestMessage: {
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
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
