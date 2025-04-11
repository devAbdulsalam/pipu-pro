import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			min: 2,
			max: 100,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			max: 50,
		},
		password: {
			type: String,
			required: true,
			min: 5,
		},
		phone: {
			type: String,
			min: 9,
		},
		avatar: {
			public_id: {
				type: String,
			},
			url: {
				type: String,
			},
		},
		role: {
			type: String,
			enum: [
				'USER',
				'GUEST_HOST',
				'GUEST',
				'COMPANY',
				'COMPANY_ADMIN',
				'ADMIN',
				'SUPER_ADMIN',
			],
			default: 'USER',
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		loginType: {
			type: String,
			enum: ['GOOGLE', 'GITHUB', 'EMAIL_PASSWORD'],
			default: 'EMAIL_PASSWORD',
		},
		refreshToken: String,
		emailVerificationToken: {
			type: String,
		},
		emailVerificationExpiry: {
			type: Date,
		},
	},
	{ timestamps: true }
);
userSchema.pre('save', function (next) {
	this.name = this.name.toLowerCase();
	this.email = this.email.toLowerCase();
	next();
});
const User = mongoose.model('User', userSchema);

export default User;
