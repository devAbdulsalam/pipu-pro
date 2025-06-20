import Subscription from '../models/Subscription.js';

const generateReport = async () => {
	try {
		// const currentDate = new Date();
		// Find all active subscriptions
		const activeSubscriptions = await Subscription.find({ status: 'active' });
		console.log('activeSubscriptions', activeSubscriptions);
	} catch (error) {
		console.error('Error getting subscription statuses:', error);
	}
};
export default generateReport;
