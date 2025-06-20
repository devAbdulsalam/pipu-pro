// services/notificationService.js
// import emailService from './emailService';
// import smsService from './smsService';
// import webPushService from './webPushService';
import User from '../models/User.js';

const sendNotification = async ({ userId, message, channels = ['email'] }) => {
	const user = await User.findById(userId);
	if (!user) throw new Error('User not found');

	if (channels.includes('email') && user.email) {
		console.log(message, 'Email sent successfully');
		// await emailService.sendEmail(user.email, 'Subscription Reminder', message);
	}

	// if (channels.includes('sms') && user.phoneNumber) {
	// 	await smsService.sendSMS(user.phoneNumber, message);
	// }

	// if (channels.includes('push') && user.pushSubscriptions?.length) {
	// 	for (const sub of user.pushSubscriptions) {
	// 		await webPushService.sendNotification(sub, {
	// 			title: 'Subscription Reminder',
	// 			body: message,
	// 		});
	// 	}
	// }
};
export default sendNotification;
