import mongoose, { Schema } from 'mongoose';

const CompanyPolicySchema = new Schema(
	{
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		absence: {
			consequence: [
				{
					name: {
						type: String,
						required: true,
					},
					isActive: {
						type: Boolean,
						required: true,
						default: true,
					},
				},
			],
			deductionType: [
				{
					name: {
						type: String,
						required: true,
					},
					amount: {
						type: Number,
						required: true,
					},
				},
			],
			enabledForUnapprovedAbsence: {
				type: Boolean,
				required: true,
				default: true,
			},
		},
		lateComing: {
			lateAfter: {
				type: Number,
				default: 3, //  minutes considered as lateness
				required: true,
			},
			gracePerMonth: {
				type: Number,
				default: 3,
				required: true,
			},
			consequence: [
				{
					name: {
						type: String,
						required: true,
					},
					isActive: {
						type: Boolean,
						required: true,
						default: true,
					},
				},
			],
			deductionType: [
				{
					name: {
						type: String,
						required: true,
					},
					amount: {
						type: Number,
						required: true,
					},
				},
			],
			enabledPolicy: {
				type: Boolean,
				required: true,
				default: true,
			},
		},
	},
	{ timestamps: true }
);

const CompanyPolicy = mongoose.model('CompanyPolicy', CompanyPolicySchema);
export default CompanyPolicy;
