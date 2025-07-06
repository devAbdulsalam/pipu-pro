import mongoose from 'mongoose';
const paymentMethodSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cardNumber: {
            type: String,
            required: true,
        },
        expiryDate: {
            type: String,
            required: true,
        },
        isDefault: Boolean,
    },
    { timestamps: true }
);

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

export default PaymentMethod;
