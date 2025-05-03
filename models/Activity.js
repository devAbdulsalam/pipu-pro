// models/Activity.ts
import mongoose, { Schema } from 'mongoose';

const ActivitySchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		description: { type: String, required: true },
		log: { type: String, required: true },
	},
	{ timestamps: true }
);

const Activity = mongoose.model('Activity', ActivitySchema);
export default Activity;
