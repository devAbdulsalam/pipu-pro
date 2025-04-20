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

const Individual = mongoose.model('Individual', IndividualSchema);
export default Individual;