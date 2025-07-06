import mongoose, { Schema } from 'mongoose';

const BenefitsSchema = new Schema(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        name: {
            type: string,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'draft'],
            default: 'active',
        },
    },
    { timestamps: true }
);

const Benefits = mongoose.model('Benefits', BenefitsSchema);
export default Benefits;
