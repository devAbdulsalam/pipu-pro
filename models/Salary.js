// models/Activity.ts
import mongoose, { Schema } from 'mongoose';

const salarySchema = new Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
    },
    { timestamps: true }
);

const Salary = mongoose.model('Salary', salarySchema);
export default Salary;
