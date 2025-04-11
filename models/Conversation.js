// models/Conversation.ts
import mongoose, { Schema } from 'mongoose';

const ConversationSchema = new Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

export const Conversation = mongoose.model('Conversation', ConversationSchema);
