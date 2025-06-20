// cron/subscriptionExpiryJob.js

import cron from 'node-cron';
import Subscription from '../models/Subscription.js';
const checkSubscriptions = async () => {
	try {
		const now = new Date();

		const result = await Subscription.updateMany(
			{
				status: 'active',
				endDate: { $lt: now },
			},
			{ $set: { status: 'expired' } }
		);

		console.log(
			`[CRON] Updated ${result.modifiedCount} subscriptions to expired.`
		);
	} catch (err) {
		console.error('[CRON] Subscription check failed:', err.message);
	}
};

export default checkSubscriptions;
