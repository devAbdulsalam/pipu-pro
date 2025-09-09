// models/Tenant.js
import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema(
	{
		phone: {
			type: String,
			unique: true,
			sparse: true,
		},
		email: {
			type: String,
			unique: true,
			sparse: true,
			lowercase: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		apartmentUnit: String,
		isRegistered: {
			type: Boolean,
			default: false,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		paymentHistory: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Payment',
			},
		],
		totalPaid: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// Auto-link to user account when registered
tenantSchema.statics.linkToUser = async function (phoneOrEmail, userId) {
	const tenant = await this.findOne({
		$or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
	});

	if (tenant) {
		tenant.userId = userId;
		tenant.isRegistered = true;
		await tenant.save();
	}

	return tenant;
};

export default mongoose.model('Tenant', tenantSchema);
