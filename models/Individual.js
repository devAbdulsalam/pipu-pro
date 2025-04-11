// models/Individual.ts
import mongoose, { Schema } from 'mongoose';

const IndividualSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

export const Individual = mongoose.model('Individual', IndividualSchema);
