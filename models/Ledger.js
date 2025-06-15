// models/Activity.ts
import mongoose, { Schema } from 'mongoose';

const ledgerSchema = new Schema(
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

const Ledger = mongoose.model('Ledger', ledgerSchema);
export default Ledger;
