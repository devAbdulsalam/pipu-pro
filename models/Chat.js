// models/Chat.ts
import mongoose, { Schema } from 'mongoose';

const ChatSchema = new Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		message: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
