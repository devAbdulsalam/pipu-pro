import mongoose, { Schema } from 'mongoose';

const NotificationSettingSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		companyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		securityAlert: {
			type: Boolean,
			required: true,
			default: true,
		},
		transactionUpdates: {
			type: Boolean,
			required: true,
			default: true,
		},
		disputeNotifications: {
			type: Boolean,
			required: true,
			default: true,
		},
		agreementUpdates: {
			type: Boolean,
			required: true,
			default: true,
		},
		milestoneUpdates: {
			type: Boolean,
			required: true,
			default: true,
		},
		platformAnnouncement: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{ timestamps: true }
);

const NotificationSetting = mongoose.model(
	'NotificationSetting',
	NotificationSettingSchema
);
export default NotificationSetting;
