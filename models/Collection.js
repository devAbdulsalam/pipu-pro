// models/Collection.js
import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
	{
		collectionCode: {
			type: String,
			unique: true,
			required: true,
		},
		hostId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: ['rent', 'service_charge', 'rent_service_charge'],
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
		dueDate: {
			type: Date,
			required: true,
		},
		frequency: {
			type: String,
			enum: ['monthly', 'one_time', 'bi_monthly', 'quarterly'],
			default: 'one_time',
		},
		receivingAccount: {
			accountName: {
				type: String,
				required: true,
			},
			accountNumber: {
				type: String,
				required: true,
			},
			bankName: {
				type: String,
				required: true,
			},
		},
		status: {
			type: String,
			enum: ['active', 'completed', 'cancelled'],
			default: 'active',
		},
		tenants: [
			{
				tenantId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Tenant',
				},
				phone: String,
				email: String,
				apartmentUnit: String,
				amountDue: Number,
				status: {
					type: String,
					enum: ['pending', 'paid', 'overdue'],
					default: 'pending',
				},
				paymentLink: String,
				uniqueCode: String,
			},
		],
		totalExpected: Number,
		totalReceived: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// Generate unique collection code
collectionSchema.pre('save', async function (next) {
	if (!this.collectionCode) {
		this.collectionCode = `COL-${Date.now()}-${Math.random()
			.toString(36)
			.substr(2, 9)}`;
	}
	next();
});

export default mongoose.model('Collection', collectionSchema);
