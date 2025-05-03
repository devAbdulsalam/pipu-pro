// models/ChatMessage.ts
import mongoose, { Schema } from 'mongoose';

const ChatMessageSchema = new Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {
			type: String,
		},
		attachments: {
			type: [
				{
					url: String,
					localPath: String,
				},
			],
			default: [],
		},
		msgType: {
			type: String,
			enum: ['msg', 'trans', 'noti', 'ctrb'],
			default: 'msg',
		},
		readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		chat: {
			type: Schema.Types.ObjectId,
			ref: 'Chat',
		},
	},
	{
		timestamps: true,
	}
);

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
export default ChatMessage;