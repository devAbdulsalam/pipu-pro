import mongoose from 'mongoose'
import cron from 'node-cron'
import Subscription from '../models/Subscription.js'
import NotificationService from '../services/NotificationService.js' // hypothetical service

// Helper function to get date without time for accurate comparison
const getDateOnly = (date) => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};


// Extend your Subscription schema to track sent reminders, e.g.:
// sentReminders: [{ daysBefore: Number, sentAt: Date }]
// Make sure to add this field in your schema if not present.

const sendReminder = async (subscription, daysLeft) => {
    try {
        // Check if reminder for this daysLeft has already been sent
		const alreadySent = subscription.sentReminders?.some(
            (reminder) => reminder.daysBefore === daysLeft
		);
        
		if (alreadySent) {
            console.log(
                `Reminder for ${daysLeft} days before already sent for subscription ${subscription._id}`
			);
			return;
		}
        
		// Compose notification message
		const message = `Your subscription will expire in ${daysLeft} day(s). Please renew to continue enjoying our service.`;
        
		// Example: send email, SMS, or push notification via your notification service
		await NotificationService.send({
            userId: subscription.userId,
			message,
			channels: ['email', 'sms', 'push'], // adjust as needed
		});
        
		// Track that reminder was sent
		subscription.sentReminders = subscription.sentReminders || [];
		subscription.sentReminders.push({
            daysBefore: daysLeft,
			sentAt: new Date(),
		});
		await subscription.save();
        
		console.log(
            `Sent ${daysLeft}-day reminder for subscription ${subscription._id}`
		);
	} catch (error) {
        console.error(
            `Failed to send reminder for subscription ${subscription._id}:`,
			error
		);
	}
};

const scheduleReminderJob = () => {
	cron.schedule('1 0 * * *', async () => {
		try {
			const today = getDateOnly(new Date());

			// Dates for reminders
			const reminderDays = [5, 3, 1];
			const reminderDates = reminderDays.map((days) => {
				const d = new Date(today);
				d.setDate(d.getDate() + days);
				return d;
			});

			// Find active subscriptions ending in 5, 3, or 1 day(s)
			const subscriptions = await Subscription.find({
				status: 'active',
				endDate: { $in: reminderDates },
			});

			subscriptions.forEach((subscription) => {
				const daysLeft = Math.round(
					(subscription.endDate - today) / (1000 * 60 * 60 * 24)
				);
				sendReminder(subscription, daysLeft);
			});

			console.log('Reminders sent for expiring subscriptions.');
		} catch (error) {
			console.error('Error sending subscription reminders:', error);
		}
	});

	console.log('Subscription reminder cron job scheduled at 12:01 AM daily.');
};



// Time zone handling: Use UTC dates or consistently convert dates to a specific time zone before comparing.
// For example, normalize dates to UTC midnight to avoid off-by-one errors.

const getDateOnlyUTC = (date) => {
    return new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
	);
};

// In your cron job, use getDateOnlyUTC(new Date()) and compare with subscription.endDate normalized similarly.

export  { sendReminder, getDateOnlyUTC };
export default scheduleReminderJob;
