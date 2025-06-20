import Subscription from '../models/Subscription.js';

// Schedule the cron job to run at 12:01 AM every day
const scheduleSubscriptionExpiryJob = async () => {
	try {
		const currentDate = new Date();
		// Find all active subscriptions
		const activeSubscriptions = await Subscription.find({ status: 'active' });

		// Update status if endDate has passed
		for (const subscription of activeSubscriptions) {
			if (subscription.endDate < currentDate) {
				subscription.status = 'expired';
				await subscription.save();
			}
		}
		console.log('Subscription statuses updated successfully');
	} catch (error) {
		console.error('Error updating subscription statuses:', error);
	}
};
export default scheduleSubscriptionExpiryJob;
