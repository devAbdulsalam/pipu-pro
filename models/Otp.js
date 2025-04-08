import mongoose from mongoose
import {
	mongooseSchemaConfig,
} from '../utils/config/mongooseSchemaConfig';

const otpSchema = new mongoose.Schema(
	{
		otp: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		expirationTime: {
			type: Date,
			required: true,
		},
	},
	
	{ timestamps: true }
);

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
// This schema is used to store the OTP (One Time Password) for a user.