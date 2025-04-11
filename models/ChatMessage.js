// models/ChatMessage.ts
import mongoose, { Schema } from 'mongoose';

const ChatMessageSchema = new Schema(
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

export const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
