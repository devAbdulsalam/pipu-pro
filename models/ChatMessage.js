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
			required: true,
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
		readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		chatId: {
			type: Schema.Types.ObjectId,
			ref: 'Chat',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
export default ChatMessage;